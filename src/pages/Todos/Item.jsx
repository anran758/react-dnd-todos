import React, { memo, useMemo, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import classnames from 'classnames';

import { CARD } from './types';
import styles from './index.module.css';

const TodoItem = memo(
  ({ id, text, complate, active, onMove, onActive, onClose, onCompolate }) => {
    const ref = useRef(null);
    const [{ isDragging }, connectDrag] = useDrag({
      item: { id, type: CARD },
      collect: (monitor) => {
        const result = {
          isDragging: monitor.isDragging(),
        };
        return result;
      },
    });
    const [, connectDrop] = useDrop({
      accept: CARD,
      hover({ id: draggedId }) {
        if (draggedId !== id) {
          onMove(draggedId, id);
        }
      },
    });

    connectDrag(ref);
    connectDrop(ref);

    return (
      <div
        ref={ref}
        className={classnames(styles.item, {
          [styles.light]: active,
          [styles.complate]: complate,
        })}
        style={{ opacity: isDragging ? 0 : 1 }}
      >
        <span className={styles.itemText}>{text}</span>
        <div className={styles.itemActions}>
          <span className={styles.button} onClick={() => onActive(id)}>
            {active ? '取消高亮' : '高亮'}
          </span>
          <span className={styles.button} onClick={() => onCompolate(id)}>
            {complate ? '取消完成' : '完成'}
          </span>
          <span className={styles.button} onClick={() => onClose(id)}>
            删除
          </span>
        </div>
      </div>
    );
  }
);
TodoItem.displayName = 'TodoItem';

export default TodoItem;
