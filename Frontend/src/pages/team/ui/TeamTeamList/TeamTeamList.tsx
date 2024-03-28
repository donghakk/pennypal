import React, { useCallback, useEffect, useState } from 'react';
import { TeamTeamListItem } from '@/pages/team/ui/TeamTeamListItem/TeamTeamListItem';
import { TeamTeamListPagenation } from '@/pages/team/ui/TeamTeamListPagenation/TeamTeamListPagenation';
import { getTeamList } from '@/pages/team/index';

// 페이지 변할 때 마다 API를 계속해서 요청하는 것 방지하기 위함
const API_CACHE_DATA = new Map();

type Team = {
    teamId: number;
    teamIsAutoConfirm: boolean;
    teamLeaderNickname: string;
    teamMembersNum: number;
    teamName: string;
};

export function TeamTeamList() {
    const [curPage, setCurPage] = useState<number>(1);
    const [maxPage, setMaxPage] = useState<number>(0);
    const [teamList, setTeamList] = useState<Team[]>([]);

    // fetchData: 팀 리스트 가져오기
    const fetchData = useCallback((url: string, curPage: number) => getTeamList(url, curPage), []);

    useEffect(() => {
        // cacheData: 캐시된 데이터
        const cacheData = API_CACHE_DATA.get(curPage - 1);

        // 1. 캐시 데이터가 없거나 만료된 데이터라면
        if (!cacheData || cacheData.exp.getTime() < new Date().getTime()) {
            // 1-1. API 요청하기
            fetchData('', curPage - 1)
                .then((res) => {
                    // 1-2. 응답 데이터로 리렌더링
                    setMaxPage(res.data.data.totalPages);
                    setTeamList(res.data.data.content);

                    // 1-3. 응답 데이터 캐싱하기
                    API_CACHE_DATA.set(curPage - 1, {
                        data: res.data.data,
                        exp: new Date(new Date().getTime() + 1000 * 60 * 10),
                    });
                })
                .catch((err) => console.log(err));
        } else {
            // 2. 캐시 데이터가 있다면 캐시 데이터 사용하기
            setMaxPage(cacheData.data.totalPages);
            setTeamList(cacheData.data.content);
        }
    }, [curPage]);

    return (
        <>
            <div className="teamTeamList">
                {teamList.map((it) => (
                    <TeamTeamListItem
                        teamId={it.teamId}
                        name={it.teamName}
                        head={it.teamMembersNum}
                        leader={it.teamLeaderNickname}
                        description={'소개'}
                        key={it.teamId}
                    />
                ))}
            </div>
            <TeamTeamListPagenation curPage={curPage} setCurPage={setCurPage} maxPage={maxPage} />
        </>
    );
}
