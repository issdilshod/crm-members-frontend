import { useState } from "react";
import { Collapse } from "react-bootstrap";

import Select from '../Input/Select';
import Input from "../Input/Input";
import { useEffect } from "react";
import { TbChevronDown, TbChevronUp, TbPlus, TbX } from "react-icons/tb";

const MobilePhones = ({index, title, defaultOpen = true, hasPlus = false, isExtra = false, errorArray = {}, form, setForm, query = ''}) => {

    const [isOpen, setIsOpen] = useState(defaultOpen);

    const [cardOnFileShow, setCardOnFileShow] = useState(false);

    const [entity] = useState({'business_mobile_number': '', 'business_mobile_provider': '', 'business_mobile_website': '', 'business_mobile_login': '', 'business_mobile_password': '', 'card_on_file': '', 'card_last_four_digit': '', 'card_holder_name': ''});
    const [inForm, setInForm] = useState(entity);

    useEffect(() => {
        if (!isExtra){
            if (form['card_on_file']=='YES'){
                setCardOnFileShow(true);
            }else{
                setCardOnFileShow(false);
            }

            setInForm({
                'business_mobile_number': form['business_mobile_number'], 
                'business_mobile_provider': form['business_mobile_provider'], 
                'business_mobile_website': form['business_mobile_website'], 
                'business_mobile_login': form['business_mobile_login'], 
                'business_mobile_password': form['business_mobile_password'], 
                'card_on_file': form['card_on_file'], 
                'card_last_four_digit': form['card_last_four_digit'], 
                'card_holder_name': form['card_holder_name']
            });
        }else{
            if (form['business_mobiles'][index]['card_on_file']=='YES'){
                setCardOnFileShow(true);
            }else{
                setCardOnFileShow(false);
            }

            setInForm(form['business_mobiles'][index]);
        }
    }, [form])

    const onChange = (e) => {
        const {value, name} = e.target;

        let tmpArray = {...form};

        if (!isExtra){
            tmpArray[name] = value;
        }else{
            tmpArray['business_mobiles'][index][name] = value;
        }

        setForm(tmpArray);
    }

    const onPlusClick = () => {
        let tmpArray = {...form};

        tmpArray['business_mobiles'].push(entity);

        setForm(tmpArray);
    }

    const onCloseClick = () => {
        let tmpArray = {...form};

        if ('uuid' in tmpArray['business_mobiles'][index]){
            if (tmpArray['business_mobiles_to_delete']){
                tmpArray['business_mobiles_to_delete'].push(tmpArray['business_mobiles'][index]['uuid']);
            }else{
                tmpArray['business_mobiles_to_delete'] = [tmpArray['business_mobiles'][index]['uuid']];
            }
            
        }
        tmpArray['business_mobiles'].splice(index, 1);

        setForm(tmpArray);
    }

    return (
        <div className='dd-card c-position-relative'>

            { hasPlus &&
                <div
                    className='d-btn d-btn-sm d-btn-action d-btn-primary'
                    style={{'position': 'absolute', 'top': '15px', 'right': '-26px', 'border-radius': '0px 20px 20px 0px'}}
                    onClick={ () => { onPlusClick() } }
                >
                    <i>
                        <TbPlus />
                    </i>
                </div>
            }

            { isExtra &&
                <span 
                    className='d-btn d-btn-sm d-btn-action d-btn-danger'
                    style={{'position': 'absolute', 'top': '15px', 'right': '-26px', 'border-radius': '0px 20px 20px 0px'}}
                    onClick={ ()=> onCloseClick() }
                >
                    <i>
                        <TbX />
                    </i>
                </span>
            }

            <div className='dd-card-head d-flex' onClick={ () => { setIsOpen(!isOpen) } }>
                <div className='mr-auto'>{title}</div>
                <div>
                    <i>
                        { isOpen &&
                            <TbChevronUp />
                        }

                        { !isOpen &&
                            <TbChevronDown />
                        }
                    </i>
                </div>
            </div>
            <div className='dd-card-body container-fluid'>
                <Collapse
                    in={isOpen}
                >
                    <div className='row'>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='Business Mobile Number'
                                name='business_mobile_number'
                                onChange={onChange}
                                defaultValue={inForm['business_mobile_number']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Select 
                                title='Business Mobile Provider'
                                name='business_mobile_provider'
                                onChange={onChange}
                                defaultValue={inForm['business_mobile_provider']}
                                options={[
                                    {'value': 'Verizon', 'label': 'Verizon'},
                                    {'value': 'T-Mobile', 'label': 'T-Mobile'},
                                    {'value': 'Simple Mobile', 'label': 'Simple Mobile'},
                                    {'value': 'None', 'label': 'None'}
                                ]}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12'>
                            <Input 
                                title='Business Mobile Website'
                                name='business_mobile_website'
                                onChange={onChange}
                                defaultValue={inForm['business_mobile_website']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='Business Mobile Login'
                                name='business_mobile_login'
                                onChange={onChange}
                                defaultValue={inForm['business_mobile_login']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12 col-sm-6'>
                            <Input
                                title='Business Mobile Password'
                                extraClass='input-none-transform'
                                name='business_mobile_password'
                                onChange={onChange}
                                defaultValue={inForm['business_mobile_password']}
                                errorArray={errorArray}
                                query={query}
                            />
                        </div>

                        <div className='col-12'>
                            <Select 
                                title='Credit card on file'
                                name='card_on_file'
                                onChange={onChange}
                                options={[
                                    {'value': 'YES', 'label': 'YES'},
                                    {'value': 'NO', 'label': 'NO'},
                                ]}
                                defaultValue={inForm['card_on_file']}
                                errorArray={errorArray}
                            />

                            { cardOnFileShow && 
                                <div className='row'>
                                    <div className='c-form-field col-12 col-sm-6'>
                                        <Input 
                                            title='Payment card last 4 digits'
                                            name='card_last_four_digit'
                                            onChange={onChange}
                                            defaultValue={inForm['card_last_four_digit']}
                                            errorArray={errorArray}
                                        />
                                    </div>

                                    <div className='c-form-field col-12 col-sm-6'>
                                        <Input 
                                            title='Card holder name'
                                            name='card_holder_name'
                                            onChange={onChange}
                                            defaultValue={inForm['card_holder_name']}
                                            errorArray={errorArray}
                                        />
                                    </div>
                                </div>
                            }
                        </div>

                    </div>
                </Collapse>
            </div>
        </div>
    )
}

export default MobilePhones;