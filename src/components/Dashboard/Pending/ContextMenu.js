import { useRef } from "react";
import { TbCheck, TbX } from "react-icons/tb";

const ContextMenu = ({position, show, outsideClick, selectClick, unselectClick}) => {

    const pendingContextMenuRef = useRef(null);
    outsideClick(pendingContextMenuRef);

    return (
        <div 
            ref={pendingContextMenuRef}
            className={`context-menu t-cursor-pointer ${show?'context-menu-active':''}`}
            style={{'left': position.x, 'top': position.y}}
        >
            <div onClick={() => { selectClick() } }><i> <TbCheck /> </i>Select</div>
            <div onClick={ () => { unselectClick() } }><i> <TbX /> </i>Unselect</div>
        </div>
    );
}

export default ContextMenu;