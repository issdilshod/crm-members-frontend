import { useRef } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

const ContextMenu = ({position, show, outsideClick, selectClick, unselectClick}) => {

    const pendingContextMenuRef = useRef(null);
    outsideClick(pendingContextMenuRef);

    return (
        <div 
            ref={pendingContextMenuRef}
            className={`context-menu t-cursor-pointer ${show?'context-menu-active':''}`}
            style={{'left': position.x, 'top': position.y}}
        >
            <div onClick={() => { selectClick() } }><i> <FaCheck /> </i>Select</div>
            <div onClick={ () => { unselectClick() } }><i> <FaTimes /> </i>Unselect</div>
        </div>
    );
}

export default ContextMenu;