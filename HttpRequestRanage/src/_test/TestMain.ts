
import GameConfig from "../GameConfig";
import HRHead from "../HttpRequestRange/HRHead";
import HRange from "../HttpRequestRange/HRRange";
import FileTask from "../HttpRequestRange/FileTask";

 class TestMain 
{
    constructor() 
    {
		this.InitLaya();


		if(Laya.Browser.onWeiXin)
		{
			Laya.URL.basePath = "http://192.168.1.8:8901/bin/";
        }
        


        var urlList =
        [
            "https://h5-jjsg-cdn6.123u.com/testlaya/web/res3dzip/pve_001-01.zip",
            // "https://blog.ihaiu.com/assets/down/ihaiu.MnutiThreadDownload%20For%20Windows.zip",
            // "https://h5-jjsg-cdn6.123u.com/testlaya/web/version.json",
            // "http://blog.ihaiu.com",
           

            // "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Scene_PVE_001_003-2d24d048b9.zip",
            // "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/UnityBuiltin-bb6d87a30c.zip",
            // "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Hero_1001_Dianguanglongqi_Skin1-92eee2d8ca.zip",
            // "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Monster_2003_langyabing_Skin1-ef9a8b4b9a.zip",
            // "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Monster_2012_Laohu_Skin1-0a28ac8ce7.zip",
            // "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Monster_4001_Fujiang_Skin1-19b9eff80d.zip",
            // "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Effect_1001_Dianguanglongqi_Skin1-803555b774.zip",
            // "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Effect_1001_Dianguanglongqi_Skin1____Effect_1002_Fengyunzhanji_Skin1____Effect_1004_Dongzhuo_Skin1-957180163b.zip",
            // "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Effect_1001_Dianguanglongqi_Skin1____Effect_1002_Fengyunzhanji_Skin1____Effect_1004_Dongzhuo_Skin1-957180163b.zip",
            // "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Effect_1001_Dianguanglongqi_Skin1____Effect_1004_Dongzhuo_Skin1-f1fe61b0c6.zip",
            // "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Assets___GameArt___Effect-7dce0d45c5.zip",
            // "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Effect_2003_langyabing_Skin1-aac9fb443d.zip",
            // "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Effect_000_BehitCommon-4f9cec9d90.zip",
            // "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/general_impact_02-2c70e910ba.zip",
            // "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Effect_Text_Forward-e83d2b6598.zip",
            // "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Assets-dcef28f04b.zip",
            // "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Effect_Text_Arrow-daf449a333.zip",
            // "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Effect_000_Circle-bac4045cd4.zip"
        ];

        FileTask.MaxBlockNum = 2;
        HRHead.MaxNum = 5;
        HRange.MaxNum = 5;
        
        for(var url of urlList)
        {
            // HRHead.RequestSize(url, this.onFileSize, this);
            FileTask.Request(url, this.onFileEnd, this, "arraybuffer");
            // FileTask.Request(url, this.onFileEnd, this, "ms-stream");
            
            // FileTask.Request(url, this.onFileEnd, this, "moz-chunked-arraybuffer");
            // break;

            // Laya.loader.load(url, Laya.Handler.create(this, this.onLayaLoad, [url]), null, Laya.Loader.BUFFER);
        }

        window['testMain'] = this;
		
    }

    onLayaLoad(response, url: string)
    {
        console.log(url);
        console.log(response);
        this.fileResponseObj[url] = response;
    }


    fileResponseObj = {};
    onFileEnd(response:any, url)
    {
        console.log(url);
        console.log(response);
        this.fileResponseObj[url] = response;
        // this.ab2str(response, (str)=>{
        //     console.log(str);
        // });
    }
    
    onFileSize(error: number, fileSize: number, url: string)
    {
        console.log("error:", error, "fileSize:", fileSize,",",  bToStr(fileSize), "url:", url);
        
    }

	//ArrayBuffer转字符串
     ab2str(u,f) {
        var b = new Blob([u]);
        var r = new FileReader();
         r.readAsText(b, 'utf-8');
         r.onload = function (){if(f)f.call(null,r.result)}
     }
     //字符串转字符串ArrayBuffer
      str2ab(s,f) {
         var b = new Blob([s],{type:'text/plain'});
         var r = new FileReader();
         r.readAsArrayBuffer(b);
         r.onload = function (){if(f)f.call(null,r.result)}
     }

	InitLaya()
	{
		//根据IDE设置初始化引擎		
		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		Laya.stage.alignV = GameConfig.alignV;
		Laya.stage.alignH = GameConfig.alignH;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		Laya.Shader3D.debugMode = true;

		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		// if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError = true;
	}


}


//激活启动类
new TestMain();