/**
 * @file use-mount.ts
 * @description 컴포넌트가 마운트되었는지 여부를 알려주는 React 커스텀 훅을 정의합니다.
 */

import { useEffect, useState } from "react";

/**
 * @name useMount
 * @description 클라이언트 컴포넌트가 DOM에 마운트(mount)되었는지 여부를 추적하는 커스텀 훅입니다.
 * 컴포넌트가 렌더링된 이후에만 실행되어야 하는 로직(예: 특정 DOM 요소에 접근, 브라우저 API 사용)에 유용합니다.
 * 
 * @returns {boolean} 컴포넌트가 마운트되었으면 `true`, 그렇지 않으면 `false`를 반환합니다.
 * 
 * @example
 * const isMounted = useMount();
 * 
 * useEffect(() => {
 *   if (isMounted) {
 *     // 이 코드는 컴포넌트가 마운트된 이후에만 실행됩니다.
 *     window.addEventListener(...);
 *   }
 * }, [isMounted]);
 */
export default function useMount() {
  // 'didMount' 상태는 컴포넌트의 마운트 여부를 저장합니다. 초기값은 false입니다.
  const [didMount, doMount] = useState(false);

  // useEffect는 컴포넌트가 렌더링된 후에 실행됩니다.
  useEffect(() => {
    // 아직 마운트 상태가 아니라면(최초 렌더링 후 1회만 실행됨)
    if (!didMount) {
      // 마운트 상태를 true로 변경합니다. 이로 인해 리렌더링이 발생할 수 있습니다.
      doMount(true);
    }
    // 의존성 배열이 없으므로, 이 useEffect는 렌더링될 때마다 실행됩니다.
    // 하지만 didMount가 true가 된 이후에는 if 조건문이 거짓이 되어 아무 작업도 하지 않습니다.
  });

  // 현재의 마운트 상태를 반환합니다.
  return didMount;
}
