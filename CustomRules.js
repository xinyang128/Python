import System;
import System.Windows.Forms;
import Fiddler;

// INTRODUCTION
// This is the FiddlerScript Rules file, which creates some of the menu commands and
// other features of Fiddler. You can edit this file to modify or add new commands.
// 
// The original version of this file is named SampleRules.js and it is in the
// \Program Files\Fiddler\ folder. When Fiddler first starts, it creates a copy named
// CustomRules.js inside your \Documents\Fiddler2\Scripts folder. If you make a 
// mistake in editing this file, simply delete the CustomRules.js file and restart
// Fiddler. A fresh copy of the default rules will be created from the original
// sample rules file.
 
// GLOBALIZATION NOTE:
// Be sure to save this file with UTF-8 Encoding if using any non-ASCII characters
// in strings, etc.

// JScript.NET Reference
// http://fiddler2.com/r/?msdnjsnet
//
// FiddlerScript Reference
// http://fiddler2.com/r/?fiddlerscriptcookbook
//
// FiddlerScript Editor: 
// http://fiddler2.com/fiddlerscript-editor

class Handlers
{
    // The following snippet demonstrates a custom-bound column for the Web Sessions list.
    // See http://fiddler2.com/r/?fiddlercolumns for more info
    /*
      public static BindUIColumn("Method", 60)
      function FillMethodColumn(oS: Session): String {
         return oS.RequestMethod;
      }
    */

    // The following snippet demonstrates how to create a custom tab that shows simple text
    /*
       public BindUITab("Flags")
       static function FlagsReport(arrSess: Session[]):String {
        var oSB: System.Text.StringBuilder = new System.Text.StringBuilder();
        for (var i:int = 0; i<arrSess.Length; i++)
        {
            oSB.AppendLine("SESSION FLAGS");
            oSB.AppendFormat("{0}: {1}\n", arrSess[i].id, arrSess[i].fullUrl);
            for(var sFlag in arrSess[i].oFlags)
            {
                oSB.AppendFormat("\t{0}:\t\t{1}\n", sFlag.Key, sFlag.Value);
            }
        }
        return oSB.ToString();
    }
    */

    // You can create a custom menu like so:
    /*
    QuickLinkMenu("&Links") 
    QuickLinkItem("IE GeoLoc TestDrive", "http://ie.microsoft.com/testdrive/HTML5/Geolocation/Default.html")
    QuickLinkItem("FiddlerCore", "http://fiddler2.com/fiddlercore")
    public static function DoLinksMenu(sText: String, sAction: String)
    {
        Utilities.LaunchHyperlink(sAction);
    }
    */ 
   

    //-------------------------------user--start1----------------
    //新建工具栏项目
    QuickLinkMenu("&Links") 
    QuickLinkItem("IE GeoLoc TestDrive", "http://ie.microsoft.com/testdrive/HTML5/Geolocation/Default.html")
    QuickLinkItem("FiddlerCore", "http://fiddler2.com/fiddlercore")
    public static function DoLinks1Menu(sText: String, sAction: String)
    {
        Utilities.LaunchHyperlink(sAction);
    }

    //新增一列显示目标主机IP
    public static BindUIColumn("&hehe", 60)
    function FillMethodColumn(oS: Session): String {
     return oS.m_hostIP;
    }

    //新建右键菜单,测试Session
    public static ContextAction("&Test fun")
    function DotestContext(oSessions: Session[]) {
        for (var x:int = 0; x < oSessions.Length; x++){

            FiddlerObject.alert(oSessions[x].port)
            
        }
    }



    public static RulesOption("Hide 3104s","hehe")
    BindPref("fiddlerscript.rules.Hide3104s")
    var m_Hide3104s: boolean = false;

    //Main函数在Script加载时执行一次
    // The Main() function runs everytime your FiddlerScript compiles
    static function Main() {
        var today: Date = new Date();
        FiddlerObject.StatusText = " CustomRules1.js was loaded at: " + today;

        //添加列，显示目前IP
        // Uncomment to add a "Server" column containing the response "Server" header, if present
        UI.lvSessions.AddBoundColumn("Server IP", 120, "X-HostIP");  
        // UI.lvSessions.AddBoundColumn("Server", 50, "@response.server");

        //绑定热键
        // Uncomment to add a global hotkey (Win+G) that invokes the ExecAction method below...
        // UI.RegisterCustomHotkey(Keys.LShiftKey, Keys.G, "test1"); 
        UI.RegisterCustomHotkey(HotkeyModifiers.Shift, Keys.Z, "custom_exec1"); 
    }

    static function test_func() {
        FiddlerObject.alert("test_func")
    }

    static function custom_onBeforeRequest(oSession: Session){
        
        /*
        Session索引属性：
        ui-color:颜色
        ui-bold:加粗
        ui-hide:隐藏
        ui-backcolor:背景色
        x-breakrequest:在request时断点
        x-breakresponse:在response时断点
        x-overridehost:覆盖该host,变相改host
        
        request-trickle-delay:请求包延迟,数值表示1KB花费的时间
        response-trickle-delay:返回包延迟,数值表示1KB花费的时间
        X-AutoAuth
        
        x-ProcessInfo

         */
         if (oSession.uriContains("mp4")) { 
            oSession["ui-color"] = "purple";
            oSession["ui-bold"] = "custom";
            oSession["ui-backcolor"] = "Lavender";
            oSession["X-AutoAuth"] = "(default)";
            // oSession["x-overridehost"] = "175.6.0.48";
            // oSession["x-breakrequest"]="uri";
            // oSession["response-trickle-delay"]=50;
        }else{
             oSession["ui-hide"] = "custom";
        }

        // if (oSession.hostname.indexOf("card.mp4?")>-1 ) {
        //     // oSession.hostname = "yfpull.showself.com"
        //     // oSession.host = "172.17.11.163"
        //     // oSession.port = 2388
         
        // }else{
        //     oSession["ui-hide"] = "custom";
        // } 
        if (oSession.uriContains(".jpg") 
        || oSession.uriContains(".gif")
        || oSession.uriContains(".png")
        || oSession.uriContains(".js")
        || oSession.uriContains(".css")
        || oSession.uriContains(".png")
        || ( oSession.port == 443)
        ){
          oSession["ui-hide"] = "custom";  
            
        }

    }

    static function custom_onBeforeResponse(oSession: Session){
        // FiddlerObject.StatusText = "custom_onBeforeResponse";
        // FiddlerObject.alert("test_func")
        // 
        if( (oSession.url.indexOf("aipai.com")>-1) 
         && (oSession.oResponse["Content-Length"] < 1048000 )
          ) {     
            // FiddlerObject.alert(oSession.oResponse["Content-Length"])
            // FiddlerApplication.Log.LogFormat("Sessi111on {0}: Response header peek shows status is {1}", oSession.id, oSession.responseCode);
            oSession.utilDecodeResponse()
            oSession.utilReplaceRegexInResponse("%2Fhc","%2Fyhc");
            oSession.utilReplaceRegexInResponse("%2Fdhc","%2Fyhc");
            // FiddlerObject.alert;

        }

        //自动替换contents内容
        if ((null != content_Replace) 
            && ( (oSession.url.indexOf(theURL)>-1) || (theURL=="0") )

        ) {   // Case sensitive
            oSession.utilDecodeResponse()
            oSession.utilReplaceRegexInResponse(content_Replace,content_ReplaceWith);
            // FiddlerObject.alert;

        }
    }
    static function custom_OnPeekAtResponseHeaders(oSession: Session) {
        
        if( (oSession.url.indexOf("aipai.com")>-1) 
         && (oSession.oResponse["Content-Length"] < 1048000 )
          ) {     
            // FiddlerApplication.Log.LogFormat("Session {0}: Response header peek shows status is {1}", oSession.id, oSession.responseCode);
            oSession.bBufferResponse = true
        }
    }
    static function custom_OnExecAction(sParams: String[]){

        var sAction = sParams[0].toLowerCase();
        switch (sAction) {

            
            case "custom_exec1":
                test_func()
                return true;
            case "conreplace":
                if (sParams.Length<4) {content_Replace=null; FiddlerObject.StatusText="replace_content cleared"; return false;}
                theURL = sParams[1];
                content_Replace=sParams[2];
                content_ReplaceWith=sParams[3];
                FiddlerObject.StatusText="Replacing [" + content_Replace + "] in Contents with [" + content_ReplaceWith + "] on the ["+theURL +"]";
                return true;
            default:
                if (sAction.StartsWith("http") || sAction.StartsWith("www.")) {
                    System.Diagnostics.Process.Start(sParams[0]);
                    return true;
                }
                else
                {
                    FiddlerObject.StatusText = "Requested ExecAction: '" + sAction + "' not found. Type HELP to learn more.";
                    return false;
                }
            }

    }

    //-------------------------------user--end----------------
    


    public static RulesOption("Hide 304s")
    BindPref("fiddlerscript.rules.Hide304s")
    var m_Hide304s: boolean = false;



    // Cause Fiddler to override the Accept-Language header with one of the defined values
    public static RulesOption("Request &Japanese Content")
    var m_Japanese: boolean = false;

    // Automatic Authentication
    public static RulesOption("&Automatically Authenticat1e")
    BindPref("fiddlerscript.rules.AutoAuth")
    var m_AutoAuth: boolean = false;

    // Cause Fiddler to override the User-Agent header with one of the defined values
    RulesString("&User-Agents", true) 
    BindPref("fiddlerscript.ephemeral.UserAgentString")
    RulesStringValue(0,"Netscape &3", "Mozilla/3.0 (Win95; I)")
    RulesStringValue(1,"WinPhone7", "Mozilla/4.0 (compatible: MSIE 7.0; Windows Phone OS 7.0; Trident/3.1; IEMobile/7.0; SAMSUNG; SGH-i917)")
    RulesStringValue(2,"WinPhone8.1", "Mozilla/5.0 (Mobile; Windows Phone 8.1; Android 4.0; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 520) like iPhone OS 7_0_3 Mac OS X AppleWebKit/537 (KHTML, like Gecko) Mobile Safari/537")

    public static var sUA: String = null;


    // Cause Fiddler to delay HTTP traffic to simulate typical 56k modem conditions
    public static RulesOption("Simulate &Modem Speeds", "Per&formance")
    var m_SimulateModem: boolean = false;

    // Removes HTTP-caching related headers and specifies "no-cache" on requests and responses
    public static RulesOption("&Disable Caching", "Per&formance")
    var m_DisableCaching: boolean = false;

    public static RulesOption("Cache Always &Fresh", "Per&formance")
    var m_AlwaysFresh: boolean = false;

        
    // Force a manual reload of the script file.  Resets all
    // RulesOption variables to their defaults.
    public static ToolsAction("Reset Script")
    function DoManualReload() { 
        FiddlerObject.ReloadScript();
    }

    public static ContextAction("Decode Selected Sessions")
    function DoRemoveEncoding(oSessions: Session[]) {
        for (var x:int = 0; x < oSessions.Length; x++){
            oSessions[x].utilDecodeRequest();
            oSessions[x].utilDecodeResponse();
        }
        UI.actUpdateInspector(true,true);
    }


    static function OnBoot() {
        // MessageBox.Show("Fiddler has finished booting");
        // System.Diagnostics.Process.Start("iexplore.exe");

        // UI.ActivateRequestInspector("HEADERS");
        // UI.ActivateResponseInspector("HEADERS");
    }
    
    static function OnShutdown() {
        // MessageBox.Show("Fiddler has shutdown");
    }

    static function OnAttach() {
        // MessageBox.Show("Fiddler is now the system proxy");
    }

    static function OnDetach() {
        // MessageBox.Show("Fiddler is no longer the system proxy");
    }

    static function OnBeforeRequest(oSession: Session) {
        //-------------------------------user--start2----------------

        custom_onBeforeRequest(oSession);

         //-------------------------------user--end----------------
        // Sample Rule: Flag POSTs to fiddler2.com in italics
        // if (oSession.HostnameIs("www.fiddler2.com") && oSession.HTTPMethodIs("POST")) {  oSession["ui-italic"] = "yup";  }

        // Sample Rule: Break requests for URLs containing "/sandbox/"
        // if (oSession.uriContains("/sandbox/")) {
        //     oSession.oFlags["x-breakrequest"] = "yup";   // Existence of the x-breakrequest flag creates a breakpoint; the "yup" value is unimportant.
        // }

        if ((null != gs_ReplaceToken) && (oSession.url.indexOf(gs_ReplaceToken)>-1)) {   // Case sensitive
            oSession.url = oSession.url.Replace(gs_ReplaceToken, gs_ReplaceTokenWith); 
        }
        if ((null != gs_OverridenHost) && (oSession.host.toLowerCase() == gs_OverridenHost)) {
            oSession["x-overridehost"] = gs_OverrideHostWith; 
        }

        if ((null!=bpRequestURI) && oSession.uriContains(bpRequestURI)) {
            oSession["x-breakrequest"]="uri";
        }

        if ((null!=bpMethod) && (oSession.HTTPMethodIs(bpMethod))) {
            oSession["x-breakrequest"]="method";
        }

        if ((null!=uiBoldURI) && oSession.uriContains(uiBoldURI)) {
            oSession["ui-bold"]="QuickExec";
        }

        if (m_SimulateModem) {
            // Delay sends by 300ms per KB uploaded.
            oSession["request-trickle-delay"] = "10"; 
            // Delay receives by 150ms per KB downloaded.
            oSession["response-trickle-delay"] = "10"; 
        }

        if (m_DisableCaching) {
            oSession.oRequest.headers.Remove("If-None-Match");
            oSession.oRequest.headers.Remove("If-Modified-Since");
            oSession.oRequest["Pragma"] = "no-cache";
        }

        // User-Agent Overrides
        if (null != sUA) {
            oSession.oRequest["User-Agent"] = sUA; 
        }

        if (m_Japanese) {
            oSession.oRequest["Accept-Language"] = "ja";
        }

        if (m_AutoAuth) {
            // Automatically respond to any authentication challenges using the 
            // current Fiddler user's credentials. You can change (default)
            // to a domain\\username:password string if preferred.
            //
            // WARNING: This setting poses a security risk if remote 
            // connections are permitted!
            oSession["X-AutoAuth"] = "(default)";
        }

        if (m_AlwaysFresh && (oSession.oRequest.headers.Exists("If-Modified-Since") || oSession.oRequest.headers.Exists("If-None-Match")))
        {
            oSession.utilCreateResponseAndBypassServer();
            oSession.responseCode = 304;
            oSession["ui-backcolor"] = "Lavender";
        }
    }

    // This function is called immediately after a set of request headers has
    // been read from the client. This is typically too early to do much useful
    // work, since the body hasn't yet been read, but sometimes it may be useful.
    //
    // For instance, see 
    // http://blogs.msdn.com/b/fiddler/archive/2011/11/05/http-expect-continue-delays-transmitting-post-bodies-by-up-to-350-milliseconds.aspx
    // for one useful thing you can do with this handler.
    //
    // Note: oSession.requestBodyBytes is not available within this function!
/*
    static function OnPeekAtRequestHeaders(oSession: Session) {
        var sProc = ("" + oSession["x-ProcessInfo"]).ToLower();
        if (!sProc.StartsWith("mylowercaseappname")) oSession["ui-hide"] = "NotMyApp";
    }
*/

    //
    // If a given session has response streaming enabled, then the OnBeforeResponse function 
    // is actually called AFTER the response was returned to the client.
    //
    // In contrast, this OnPeekAtResponseHeaders function is called before the response headers are 
    // sent to the client (and before the body is read from the server).  Hence this is an opportune time 
    // to disable streaming (oSession.bBufferResponse = true) if there is something in the response headers 
    // which suggests that tampering with the response body is necessary.
    // 
    // Note: oSession.responseBodyBytes is not available within this function!
    //
    static function OnPeekAtResponseHeaders(oSession: Session) {
        //FiddlerApplication.Log.LogFormat("Session {0}: Response header peek shows status is {1}", oSession.id, oSession.responseCode);

        custom_OnPeekAtResponseHeaders(oSession)        
        if (m_DisableCaching) {
            oSession.oResponse.headers.Remove("Expires");
            oSession.oResponse["Cache-Control"] = "no-cache";
        }

        if ((bpStatus>0) && (oSession.responseCode == bpStatus)) {
            oSession["x-breakresponse"]="status";
            oSession.bBufferResponse = true;
        }
        
        if ((null!=bpResponseURI) && oSession.uriContains(bpResponseURI)) {
            oSession["x-breakresponse"]="uri";
            oSession.bBufferResponse = true;
        }

    }

    static function OnBeforeResponse(oSession: Session) {
        //-------------------------------user--start4----------------

        custom_onBeforeResponse(oSession);

         //-------------------------------user--end----------------
        if (m_Hide304s && oSession.responseCode == 304) {
            oSession["ui-hide"] = "true";
        }
    }

/*
    // This function executes just before Fiddler returns an error that it has 
    // itself generated (e.g. "DNS Lookup failure") to the client application.
    // These responses will not run through the OnBeforeResponse function above.
    static function OnReturningError(oSession: Session) {
    }
*/
/*
    // This function executes after Fiddler finishes processing a Session, regardless
    // of whether it succeeded or failed. Note that this typically runs AFTER the last
    // update of the Web Sessions UI listitem, so you must manually refresh the Session's
    // UI if you intend to change it.
    static function OnDone(oSession: Session) {
    }
*/



    // These static variables are used for simple breakpointing & other QuickExec rules 
    BindPref("fiddlerscript.ephemeral.bpRequestURI")
    public static var bpRequestURI:String = null;

    BindPref("fiddlerscript.ephemeral.bpResponseURI")
    public static var bpResponseURI:String = null;

    BindPref("fiddlerscript.ephemeral.bpMethod")
    public static var bpMethod: String = null;

    static var bpStatus:int = -1;
    static var uiBoldURI: String = null;
    static var theURL: String = null;
    static var content_Replace: String = null;
    static var content_ReplaceWith: String = null;
    static var gs_ReplaceToken: String = null;
    static var gs_ReplaceTokenWith: String = null;
    static var gs_OverridenHost: String = null;
    static var gs_OverrideHostWith: String = null;

    // The OnExecAction function is called by either the QuickExec box in the Fiddler window,
    // or by the ExecAction.exe command line utility.
    static function OnExecAction(sParams: String[]): Boolean {

        FiddlerObject.StatusText = "ExecAction: " + sParams[0];
        var sAction = sParams[0].toLowerCase();

        //-------------------------------user--start3----------------
        custom_OnExecAction(sParams);
        //-------------------------------user--end----------------
        //
        //
        switch (sAction) {


            case "bold":
                if (sParams.Length<2) {uiBoldURI=null; FiddlerObject.StatusText="Bolding cleared"; return false;}
                uiBoldURI = sParams[1]; FiddlerObject.StatusText="Bolding requests for " + uiBoldURI;
                return true;
            case "bp":
                FiddlerObject.alert("bpu = breakpoint request for uri\nbpm = breakpoint request method\nbps=breakpoint response status\nbpafter = breakpoint response for URI");
                return true;
            case "bps":
                if (sParams.Length<2) {bpStatus=-1; FiddlerObject.StatusText="Response Status breakpoint cleared"; return false;}
                bpStatus = parseInt(sParams[1]); FiddlerObject.StatusText="Response status breakpoint for " + sParams[1];
                return true;
            case "bpv":

            case "bpm":
                if (sParams.Length<2) {bpMethod=null; FiddlerObject.StatusText="Request Method breakpoint cleared"; return false;}
                bpMethod = sParams[1].toUpperCase(); FiddlerObject.StatusText="Request Method breakpoint for " + bpMethod;
                return true;
            case "bpu":
                if (sParams.Length<2) {bpRequestURI=null; FiddlerObject.StatusText="RequestURI breakpoint cleared"; return false;}
                bpRequestURI = sParams[1]; 
                FiddlerObject.StatusText="RequestURI breakpoint for "+sParams[1];
                return true;
            case "bpa":
            case "bpafter":
                if (sParams.Length<2) {bpResponseURI=null; FiddlerObject.StatusText="ResponseURI breakpoint cleared"; return false;}
                bpResponseURI = sParams[1]; 
                FiddlerObject.StatusText="ResponseURI breakpoint for "+sParams[1];
                return true;
            case "overridehost":
                if (sParams.Length<3) {gs_OverridenHost=null; FiddlerObject.StatusText="Host Override cleared"; return false;}
                gs_OverridenHost = sParams[1].toLowerCase();
                gs_OverrideHostWith = sParams[2];
                FiddlerObject.StatusText="Connecting to [" + gs_OverrideHostWith + "] for requests to [" + gs_OverridenHost + "]";
                return true;
            case "urlreplace":
                if (sParams.Length<3) {gs_ReplaceToken=null; FiddlerObject.StatusText="URL Replacement cleared"; return false;}
                gs_ReplaceToken = sParams[1];
                gs_ReplaceTokenWith = sParams[2].Replace(" ", "%20");  // Simple helper
                FiddlerObject.StatusText="Replacing [" + gs_ReplaceToken + "] in URIs with [" + gs_ReplaceTokenWith + "]";
                return true;
            case "allbut":
            case "keeponly":
                if (sParams.Length<2) { FiddlerObject.StatusText="Please specify Content-Type to retain during wipe."; return false;}
                UI.actSelectSessionsWithResponseHeaderValue("Content-Type", sParams[1]);
                UI.actRemoveUnselectedSessions();
                UI.lvSessions.SelectedItems.Clear();
                FiddlerObject.StatusText="Removed all but Content-Type: " + sParams[1];
                return true;
            case "stop":
                UI.actDetachProxy();
                return true;
            case "start":
                UI.actAttachProxy();
                return true;
            case "cls":
            case "clear":
                UI.actRemoveAllSessions();
                return true;
            case "g":
            case "go":
                UI.actResumeAllSessions();
                return true;
            case "goto":
                if (sParams.Length != 2) return false;
                Utilities.LaunchHyperlink("http://www.google.com/search?hl=en&btnI=I%27m+Feeling+Lucky&q=" + Utilities.UrlEncode(sParams[1]));
                return true;
            case "help":
                Utilities.LaunchHyperlink("http://fiddler2.com/r/?quickexec");
                return true;
            case "hide":
                UI.actMinimizeToTray();
                return true;
            case "log":
                FiddlerApplication.Log.LogString((sParams.Length<2) ? "User couldn't think of anything to say..." : sParams[1]);
                return true;
            case "nuke":
                UI.actClearWinINETCache();
                UI.actClearWinINETCookies(); 
                return true;
            case "screenshot":
                UI.actCaptureScreenshot(false);
                return true;
            case "show":
                UI.actRestoreWindow();
                return true;
            case "tail":
                if (sParams.Length<2) { FiddlerObject.StatusText="Please specify # of sessions to trim the session list to."; return false;}
                UI.TrimSessionList(int.Parse(sParams[1]));
                return true;
            case "quit":
                UI.actExit();
                return true;
            case "dump":
                UI.actSelectAll();
                UI.actSaveSessionsToZip(CONFIG.GetPath("Captures") + "dump.saz");
                UI.actRemoveAllSessions();
                FiddlerObject.StatusText = "Dumped all sessions to " + CONFIG.GetPath("Captures") + "dump.saz";
                return true;


        }
    }
}