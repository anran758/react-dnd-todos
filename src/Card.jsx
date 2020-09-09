import React, { memo, useMemo, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

import ItemTypes from "./ItemTypes";

const style = {
  border: "1px dashed gray",
  padding: "0.5rem 1rem",
  marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "move"
};

const highLightStyle = {
  background: "blue",
  color: "#fff"
};

const complateStyle = {
  textDecoration: "line-through",
  color: "#ccc"
};

const itemStyle = { cursor: "pointer", marginLeft: 14 };

const Card = memo(
  ({
    id,
    text,
    complate,
    active,
    moveCard,
    onActive,
    onClose,
    onCompolate
  }) => {
    const ref = useRef(null);
    const [{ isDragging }, connectDrag] = useDrag({
      item: { id, type: ItemTypes.CARD },
      collect: monitor => {
        const result = {
          isDragging: monitor.isDragging()
        };
        return result;
      }
    });
    const [, connectDrop] = useDrop({
      accept: ItemTypes.CARD,
      hover({ id: draggedId }) {
        if (draggedId !== id) {
          moveCard(draggedId, id);
        }
      }
    });
    connectDrag(ref);
    connectDrop(ref);
    const opacity = isDragging ? 0 : 1;
    const containerStyle = useMemo(() => ({ ...style, opacity }), [opacity]);
    return (
      <div
        ref={ref}
        style={
          active ? { ...containerStyle, ...highLightStyle } : containerStyle
        }
      >
        <span style={complate ? complateStyle : {}}>{text}</span>
        <div style={{ float: "right" }}>
          <span style={itemStyle} onClick={() => onActive(id)}>
            {active ? "取消高亮" : "高亮"}
          </span>
          <span style={itemStyle} onClick={() => onCompolate(id)}>
            {complate ? "取消完成" : "完成"}
          </span>
          <span style={itemStyle} onClick={() => onClose(id)}>
            删除
          </span>
        </div>
      </div>
    );
  }
);
export default Card;
