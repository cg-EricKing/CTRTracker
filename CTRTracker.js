// CTR Tracking script for iHeart Accounts

// Psuedo-code
// Set up ss
// Show Account name, campaign end date, current CTR
// Get Account / Campaign - Display
// Iterate over Campaigns
// Get Stats for the last 7 days
// Conditional to check if CTR has gone below 0.10%
// Print data to ss
// Highlight red if the campaign has CTR below 0.10%
// Alert if below target

// Model after budget script - 
// End Date - Today's Date for Days Remaining
// Ordered Impressions
// Current Impressions
// Avg. Cpm
// Cost

// Current CTR 
// Target Mark
// GOOD or BAD

// iHeart Accounts
// Gold's Gym, Fairway Home Detailing, Mednax, Inc
// The Pet Vet on Patton, ProTec Security, Alan's Jwelery & Pawn


function main() {
    // init spreadsheet
    var spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1uCnUI22Nw716D698ykZYj9gc3_XG2y7_vG2Zs7oOTMA/edit?usp=sharing';
    
    var startRow = 2;
    
    // Logger.log('Using spreadsheet - %s.', spreadsheetUrl);
    var spreadsheet = SpreadsheetApp.openByUrl(spreadsheetUrl);
    var sheet = spreadsheet.getSheets()[0]; // change array index to accompnay sheet location
    var goodBadRange = sheet.getRange(13, 3);
    var GOOD = [['GOOD']];
    var BAD = [['BAD']];

    // Get the Current Account
    var currentAccount = AdWordsApp.currentAccount();
    var accountName = currentAccount.getName();
    Logger.log("Current Account: " + accountName);
    var accountNameRange = sheet.getRange(startRow, 2);
    var accountNameArray = [[accountName]];
    accountNameRange.setValues(accountNameArray);

    var orderedImpressions = sheet.getRange(2, 4).getValue();
    var emailForNotify = sheet.getRange(2,5).getValue();
    var daysRemaining = sheet.getRange(5,2).getValue();

    var TARGET_CTR = .001;

    var campaignIterator = AdWordsApp.campaigns()
        .get();
    Logger.log('Total campaigns found : ' + campaignIterator.totalNumEntities());
    while(campaignIterator.hasNext()) {
        var campaign = campaignIterator.next();
        var campaignName = campaign.getName();
        Logger.log("Campaign Name: " + campaign.getName());
        var campaignNameRange = sheet.getRange(2, 3);
        var campaignNameArray = [[campaignName]];
        campaignNameRange.setValues(campaignNameArray);

            // Grab the stats for last 7 days
           var currentStats = campaign.getStatsFor("LAST_7_DAYS");
           var currentImpressions = currentStats.getImpressions();
           var currentClicks = currentStats.getClicks();
           var currentCpm = currentStats.getAverageCpm();
           var currentCost = currentStats.getCost();
           var currentRange = sheet.getRange('B7:E7');
           var currentStatsValues = [
               [currentImpressions, currentClicks, currentCpm, currentCost]
           ];
           currentRange.setValues(currentStatsValues);
            // Grab current CTR from last 7 days
           var currentCtr = currentStats.getCtr();
           Logger.log("Current CTR: " + currentCtr);
           var currentCtrRange = sheet.getRange(13,1);
           var currentCtrArray = [[currentCtr]];
           currentCtrRange.setValues(currentCtrArray);

           // Grab All Time Campaign Stats
           var allStats = campaign.getStatsFor("ALL_TIME");
           var allImpressions = allStats.getImpressions();
           var allClicks = allStats.getClicks();
           var allAvgCpm = allStats.getAverageCpm();
           var allCost = allStats.getCost();

           var allTimeStatsValues = [
               [allImpressions, allClicks, allAvgCpm, allCost]
           ];
           var allRange = sheet.getRange('B8:E8');
           allRange.setValues(allTimeStatsValues);

    }

// Email function to pass string and send through to email provided
function notify(string) {
    MailApp.sendEmail(emailForNotify, accountName, string);
  }

if(currentCtr < TARGET_CTR) {
    // notify
    Logger.log("CTR below target mark - please address")
    // print to ss - highlight red BAD
    goodBadRange.setValues(BAD);
} else {
    // Log - Ok Status
    Logger.log("Current CTR is above target mark, Boo Yah!")
    // print to ss - GOOD
    goodBadRange.setValues(GOOD);
}
  
}