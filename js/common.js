// localStorage에서 토큰 가져오기
const getWithExpire = (key) => {
    // 토큰 불러오기
    const itemStr = localStorage.getItem(key);
    if(!itemStr) {
        return null;
    }
    const item = JSON.parse(itemStr);

    // 현재 시간이 만료시간보다 넘어가면 로컬스토리지에 저장된 토큰 삭제
    const now = new Date();
    if (now.getTime() > item.expires) {
        localStorage.removeItem(key);
        return null
    }

    // 시간이 넘지 않았다면 해당 value를 반환
    return item[key];
}

