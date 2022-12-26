import { useEffect } from 'react';
import Api from '../../../services/Api';
import { useState } from 'react';
import { TbPlus } from 'react-icons/tb';

import './Task.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import DateFormatter from '../../../services/DateFormatter';
import { useNavigate, useSearchParams } from 'react-router-dom';

import * as TASKPROGRESS from '../../../consts/Task/TaskProgress';
import MiniLoading from '../../Helper/Loading/MiniLoading';

const TaskList = ({setFormOpen, taskList, setTaskList, pusher, meUuid, taskMeta, setTaskMeta}) => {

    const api = new Api();
    const nav = useNavigate();

    const [pusherUpdates, setPusherUpdates] = useState(null);

    const [ params, setParams ] = useSearchParams();

    useEffect(() => {
        nextTask();
    }, [])

    useEffect(() => {
        if (pusherUpdates){
            findTask(pusherUpdates['data']['data']);
        }
    }, [pusherUpdates])

    useEffect(() => {
        if (meUuid!=''){
            subsribeChannel(meUuid);
        }
    }, [meUuid])

    const subsribeChannel = (uuid) => {
        let channel_task = pusher.subscribe('task_' + uuid);
        channel_task.bind('task-push', function(data) {
            setPusherUpdates(data);
        })
    }

    const findTask = (task) => {
        let tmpArray = [...taskList];

        let exists = false, exists_index;
        for (let key in tmpArray){
            if (tmpArray[key]['uuid']==task['uuid']){
                exists = true;
                exists_index = key;
                break; 
            }
        }

        if (!exists){
            tmpArray.unshift(task);
        }else{
            tmpArray[exists_index] = task;
        }

        // order
        tmpArray.sort((a, b) => {
            return new Date(b.updated_at) - new Date(a.updated_at);
        });

        setTaskList(tmpArray);
    }

    const nextTask = (attr = '') => {

        // filter attr
        attr = '?page='+parseInt(taskMeta['current_page']+1);

        api.request('/api/task' + attr, 'GET')
            .then(res => {
                if (res.status==200||res.status==201){
                    // TODO: search and destroy duplicate uuid
                    setTaskList([...taskList, ...res.data.data]);
                    setTaskMeta(res.data.meta);
                }
            })
    }

    const cardClick = (uuid) => {
        params.append('section', 'task');
        params.append('uuid', uuid);
        setParams(params);
    }

    const newTask = () => {
        params.append('section', 'task');
        setParams(params);
    }

    return (
        <div className='row'>
            <div className='col-12 col-sm-6'>

                <div className='c-position-relative'>

                    <div className='d-flex mb-2'>
                        <div className='mr-auto d-title'>Employee Tasks ({taskMeta['total']})</div>
                        <div className='ml-2'>
                            <span 
                                className='d-btn d-btn-sm d-btn-primary'
                                onClick={() => { newTask() }}
                            >
                                <i>
                                    <TbPlus />
                                </i>
                            </span>
                        </div>
                    </div>

                    <div className='tasks-block' id='tasks-block-employee'>
                        <InfiniteScroll 
                            dataLength={taskList.length}
                            next={nextTask}
                            hasMore={(taskMeta['current_page']<taskMeta['last_page'])}
                            loader={<MiniLoading />}
                            scrollableTarget='tasks-block-employee'
                        >
                            {
                                taskList.map((value, index) => {
                                    return (
                                        <div 
                                            key={index}
                                            className={`t-card d-flex 
                                                        ${(value['progress']==TASKPROGRESS.REJECTED)?'t-card-danger':''}
                                                        ${(value['progress']==TASKPROGRESS.COMPLETED)?'t-card-success':''}
                                                        mb-2`}
                                            onClick={ () => { cardClick(value['uuid']) } }
                                        >
                                            <div className='mr-auto'>
                                                <div className='t-card-name'>{value['task_name']}</div>
                                                <div>
                                                    {
                                                        value['users'].map((value1, index1) => {
                                                            return (
                                                                <span key={index1} className='t-card-users mr-1' title={value1['user']['first_name'] + ' ' + value1['user']['last_name']}>
                                                                    <span>
                                                                        {value1['user']['first_name'].substr(0, 1)}
                                                                    </span>
                                                                </span>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className='t-card-due-date'>{DateFormatter.beautifulDate(value['updated_at'])}</div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </InfiniteScroll>
                    </div>

                </div>

            </div>

            <div className='col-12 col-sm-6'>
            </div>
        </div>
    )
}

export default TaskList;