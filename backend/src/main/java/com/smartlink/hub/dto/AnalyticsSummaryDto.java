package com.smartlink.hub.dto;

public class AnalyticsSummaryDto {
    private long totalLinks;
    private long profileViews;
    private long totalClicks;
    private long qrScans;

    public AnalyticsSummaryDto() {}

    public AnalyticsSummaryDto(long totalLinks, long profileViews, long totalClicks, long qrScans) {
        this.totalLinks = totalLinks;
        this.profileViews = profileViews;
        this.totalClicks = totalClicks;
        this.qrScans = qrScans;
    }

    public long getTotalLinks() { return totalLinks; }
    public void setTotalLinks(long totalLinks) { this.totalLinks = totalLinks; }

    public long getProfileViews() { return profileViews; }
    public void setProfileViews(long profileViews) { this.profileViews = profileViews; }

    public long getTotalClicks() { return totalClicks; }
    public void setTotalClicks(long totalClicks) { this.totalClicks = totalClicks; }

    public long getQrScans() { return qrScans; }
    public void setQrScans(long qrScans) { this.qrScans = qrScans; }
}
