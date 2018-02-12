// DashHound - CTR Tracking script

// Show Account name, campaign end date, current CTR
// Get Account / Campaign - Display
// Iterate over Campaigns
// Get Stats for the last 7 days
// Conditional to check if CTR has gone below 0.10%
// Print BAD if the campaign has CTR below 0.10%
// Alert if below target (Pull DashHound Account Email?)

// Stats to print in logs
// Current Budget, Bidding Strategy
// Current CTR
// Impressions, Cost, Clicks, CPM

// Conditional check
    // Current CTR of campaign
    // Target Mark for where we expect the CTR to be
    // Print GOOD or BAD based on stats pulled

function main() {

    // Get the Current Account
    var currentAccount = AdWordsApp.currentAccount();
    var accountName = currentAccount.getName();
    Logger.log("Current Account: " + accountName);

    // Init Target CTR
    var TARGET_CTR = .001;

    // Stats Function
    function getStats(range) {

        var statsRange = campaign.getStatsFor(range);
        var clicks = statsRange.getClicks();
        var impressions = statsRange.getImpressions();
        var ctr = statsRange.getCtr();
        var cost = statsRange.getCost();
        var avgCpm = statsRange.getAverageCpm();
        var cpc = statsRange.getAverageCpc();
        var conversions = statsRange.getConversions();
        var conversionRate = statsRange.getConversionRate();

        var statsValues = {
          clickStat: clicks,
          impStat: impressions,
          ctrStat: ctr,
          costStat: cost,
          cpmStat: avgCpm,
          cpcStat: cpc,
          conStat: conversions,
          crStat: conversionRate};

      Logger.log("CTR: " + statsValues.ctrStat + " " + "Clicks: " + statsValues.clickStat + " " + "Impressions: " + statsValues.impStat + " " +
                 "Cost: " + statsValues.costStat + " " + "CPM: " + statsValues.cpmStat + " " + "CPC: " + statsValues.cpcStat);

    }

    var campaignIterator = AdWordsApp.campaigns()
        .get();

    Logger.log('Total campaigns found : ' + campaignIterator.totalNumEntities());

    while(campaignIterator.hasNext()) {
        var campaign = campaignIterator.next();
        var campaignName = campaign.getName();
        var campaignBudget = campaign.getBudget().getAmount();
        var campaignBiddingStrat = campaign.getBiddingStrategyType();
        var ctrStat = campaign.getStatsFor("LAST_7_DAYS");
        var ctrCheck = ctrStat.getCtr();
        Logger.log("Campaign Name: " + campaign.getName());
        Logger.log("Current Campaign Budget: " + campaignBudget);
        Logger.log("Campaign Bidding Strategy: " + campaignBiddingStrat);
        // Grab the stats for last 7 days
        Logger.log("Current CTR & Stats Last 7 Days:");
        getStats("LAST_7_DAYS");

        // Grab All Time Campaign Stats
        Logger.log("All Time Stats:");
        getStats("ALL_TIME");

        if(CtrCheck < TARGET_CTR) {
            Logger.log("BAD -- CTR below target mark - please address")
        } else {
            // Log - Ok Status
            Logger.log("GOOD -- Current CTR is above target mark, Boo Yah!")
        }

    }

}