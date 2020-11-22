import React, { useEffect, useState, memo, useRef, useMemo, useCallback } from 'react';
import update from 'immutability-helper';
import { generate } from 'shortid';

import Item from './Item';

const STORE_LIST_KEY = 'TODO_STORE_LIST';
const STORE_MAPPING_KEY = 'TODO_STORE_MAPPING';

const style = {
  width: 600,
  margin: 'auto',
};
const Container = memo(() => {
  const [todosMapping, setTodosMapping] = useState({});
  const [todosIds, setTodosIds] = useState([]);
  const [text, setText] = useState('');

  const specifics = useRef();
  const requestedFrame = useRef();

  /**
   * 触发数据更新
   */
  // const drawFrame = ;

  /**
   * 准备触发视图更新
   */
  const scheduleUpdate = (updateSpecifics) => {
    specifics.current = updateSpecifics;

    if (!requestedFrame.current) {
      requestedFrame.current = requestAnimationFrame(() => {
        const payload = specifics.current;
        console.log('drawFrame --> ', payload);
        if (!payload) return;

        if (payload.todosMapping) {
          const nextData = update(todosMapping, payload.todosMapping);
          setTodosMapping(nextData);
        }

        if (payload.todosIds) {
          const nextData = update(todosIds, payload.todosIds);
          setTodosIds(nextData);
        }

        specifics.current = undefined;
        requestedFrame.current = undefined;
        console.log('================== drawFrame end ==================');
      });
    }
  };

  /**
   * 提交数据
   */
  const handleAdd = () => {
    if (!text) return;

    const data = {
      id: generate(),
      text,
      complate: false,
      active: false,
      createdDate: Date.now(),
    };

    scheduleUpdate({
      todosIds: { $unshift: [data.id] },
      todosMapping: { [data.id]: { $set: data } },
    });
    setText('');
  };

  /**
   * 处理用户输入的内容
   */
  const handleEnter = (e) => {
    if (e.key !== 'Enter') return;

    handleAdd();
    setText('');
  };

  /**
   * 移动 ietm 的顺序
   * @param {number | string} id
   * @param {number | string} afterId
   */
  const handleMove = (id, afterId) => {
    const currentIdx = todosIds.findIndex((todoId) => todoId === id);
    const afterIdx = todosIds.findIndex((todoId) => todoId === afterId);

    scheduleUpdate({
      todosIds: {
        $splice: [
          [currentIdx, 1],
          [afterIdx, 0, id],
        ],
      },
    });
  };

  /**
   * 使触发项处于激活状态
   */
  const handleActive = (id) => {
    scheduleUpdate({
      todosMapping: {
        [id]: { $toggle: ['active'] },
      },
    });
  };

  /**
   * Todo 完成
   * @desc 完成后将自动将任务推到队尾
   */
  const handleCompolate = (id) => {
    const cardIndex = todosIds.findIndex((item) => item === id);

    scheduleUpdate({
      todosIds: {
        $splice: [[cardIndex, 1]],
        $push: [id],
      },
      todosMapping: {
        [id]: {
          $toggle: ['complate'],
          active: { $set: false },
        },
      },
    });
  };

  const handleClose = (id) => {
    if (!window.confirm('confrim remove this todo?')) return;

    const cardIndex = todosIds.findIndex((item) => item === id);
    scheduleUpdate({
      todosIds: {
        $splice: [[cardIndex, 1]],
      },
      todosMapping: {
        $unset: [id],
      },
    });
  };

  // 组件初始化完毕
  useEffect(() => {
    const todosMapping = JSON.parse(localStorage.getItem(STORE_MAPPING_KEY)) || {};
    const todosIds = JSON.parse(localStorage.getItem(STORE_LIST_KEY)) || [];

    setTodosMapping(todosMapping);
    setTodosIds(todosIds);

    return () => requestedFrame && cancelAnimationFrame(requestedFrame);
  }, []);

  // update store data
  useEffect(() => localStorage.setItem(STORE_LIST_KEY, JSON.stringify(todosIds)), [
    todosIds,
  ]);
  useEffect(() => {
    localStorage.setItem(STORE_MAPPING_KEY, JSON.stringify(todosMapping));
  }, [todosMapping]);
  console.log('todosIds and todosMapping', todosIds, todosMapping);

  return (
    <section>
      <h2 style={{ textAlign: 'center' }}>React DnD todos</h2>
      <section style={{ marginBottom: 12, textAlign: 'center' }}>
        <input
          type="text"
          value={text}
          placeholder="input something todo..."
          style={{ marginRight: 8 }}
          onInput={(e) => setText(e.target.value)}
          onKeyDown={handleEnter}
        />
        <button onClick={handleAdd}>Submit</button>
      </section>

      <section style={style}>
        {todosIds.map((id) => {
          const data = todosMapping[id];
          return data ? (
            <Item
              key={data.id}
              id={data.id}
              text={data.text}
              active={data.active}
              complate={data.complate}
              onMove={handleMove}
              onActive={handleActive}
              onCompolate={handleCompolate}
              onClose={handleClose}
            />
          ) : null;
        })}
      </section>
    </section>
  );
});

export default Container;
