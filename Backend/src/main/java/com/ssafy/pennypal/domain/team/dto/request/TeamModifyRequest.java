package com.ssafy.pennypal.domain.team.dto.request;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TeamModifyRequest {

    private Long memberId; // 수정 시도하는 유저

    private String teamName;

    private Long teamLeaderId;

    private Boolean teamIsAutoConfirm;

    private String teamInfo;

}
