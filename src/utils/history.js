import { useState, useCallback, useRef } from 'react';

/**
 * Wraps a reducer with undo/redo history.
 * Batches rapid changes (within `batchMs`) into a single undo entry.
 */
export function useUndoReducer(reducerFn, initialState, batchMs = 600) {
  const [state, setState] = useState({
    past: [],
    present: initialState,
    future: [],
  });
  const lastPush = useRef(0);

  const dispatch = useCallback((action) => {
    setState(prev => {
      const newPresent = reducerFn(prev.present, action);
      if (newPresent === prev.present) return prev;

      const now = Date.now();
      const shouldBatch = (now - lastPush.current) < batchMs && prev.past.length > 0;

      if (shouldBatch) {
        // Replace the last undo snapshot instead of creating new one
        return { ...prev, present: newPresent, future: [] };
      }

      lastPush.current = now;
      return {
        past: [...prev.past.slice(-39), prev.present], // max 40 entries
        present: newPresent,
        future: [],
      };
    });
  }, [reducerFn, batchMs]);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.past.length === 0) return prev;
      return {
        past: prev.past.slice(0, -1),
        present: prev.past[prev.past.length - 1],
        future: [prev.present, ...prev.future.slice(0, 19)],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.future.length === 0) return prev;
      return {
        past: [...prev.past, prev.present],
        present: prev.future[0],
        future: prev.future.slice(1),
      };
    });
  }, []);

  return {
    st: state.present,
    dispatch,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}
