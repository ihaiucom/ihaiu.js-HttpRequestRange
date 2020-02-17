(function () {
    'use strict';

    var Scene = Laya.Scene;
    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        var test;
        (function (test) {
            class TestSceneUI extends Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("test/TestScene");
                }
            }
            test.TestSceneUI = TestSceneUI;
            REG("ui.test.TestSceneUI", TestSceneUI);
        })(test = ui.test || (ui.test = {}));
    })(ui || (ui = {}));

    class GameUI extends ui.test.TestSceneUI {
        constructor() {
            super();
            var scene = Laya.stage.addChild(new Laya.Scene3D());
            var camera = (scene.addChild(new Laya.Camera(0, 0.1, 100)));
            camera.transform.translate(new Laya.Vector3(0, 3, 3));
            camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
            var directionLight = scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
            directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));
            var box = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1)));
            box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
            var material = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load("res/layabox.png", Laya.Handler.create(null, function (tex) {
                material.albedoTexture = tex;
            }));
            box.meshRenderer.material = material;
        }
    }

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/GameUI.ts", GameUI);
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "test/TestScene.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class HRHead {
        constructor() {
            this.xhr = new XMLHttpRequest();
            this.xhr.onreadystatechange = (this.onEvent.bind(this));
        }
        onEvent(e) {
            console.log(this.xhr.readyState, this.xhr.status);
            if (this.xhr.readyState == 4) {
                if (this.xhr.status == 200) {
                    var fileSize = this.xhr.getResponseHeader('Content-Length');
                    console.log(fileSize);
                    this.ResultCallbak(0, parseInt(fileSize));
                }
                else {
                    console.log("HRHead 请求文件头失败");
                    this.ResultCallbak(1, -1);
                }
            }
        }
        ResultCallbak(errorCode, fileSize) {
            if (this.callback) {
                if (this.callbackObj) {
                    this.callback.call(this.callbackObj, errorCode, fileSize, this.url);
                }
                else {
                    this.callback(errorCode, fileSize, this.url);
                }
            }
            this.callback = null;
            this.callbackObj = null;
            this.xhr.abort();
            this.url = null;
            HRHead.RecoverItem(this);
        }
        Request(url, callback, callbackObj) {
            this.url = url;
            this.callback = callback;
            this.callbackObj = callbackObj;
            this.xhr.open('HEAD', url, true);
            this.xhr.send();
        }
        static GetItem() {
            if (this.pool.length > 0) {
                return this.pool.shift();
            }
            else {
                if (this.currNum < this.MaxNum) {
                    this.currNum++;
                    return new HRHead();
                }
                else {
                    return null;
                }
            }
        }
        static RecoverItem(item) {
            if (this.wait.length > 0) {
                let waitItem = this.wait.shift();
                item.Request(waitItem.url, waitItem.callback, waitItem.callbackObj);
            }
            else {
                if (this.pool.indexOf(item) == -1) {
                    this.pool.push(item);
                }
            }
        }
        static RequestSize(url, callback, callbackObj) {
            let item = this.GetItem();
            if (item) {
                item.Request(url, callback, callbackObj);
            }
            else {
                this.wait.push({ url: url, callback: callback, callbackObj: callbackObj });
            }
        }
    }
    HRHead.MaxNum = 2;
    HRHead.currNum = 0;
    HRHead.pool = [];
    HRHead.wait = [];

    class HRange {
        constructor() {
            this.xhr = new XMLHttpRequest();
            this.xhr.onreadystatechange = (this.onreadystatechange.bind(this));
            this.xhr.onprogress = (this.onprogress.bind(this));
            this.xhr.onerror = (this.onerror.bind(this));
            window['xhr'] = this;
        }
        get blockInfo() {
            return "block_" + this.block.index + ", sendIndex=" + this.block.sendIndex;
        }
        onreadystatechange(e) {
            if (!this.block) {
                return;
            }
            if (this.xhr.readyState >= XMLHttpRequest.LOADING) {
                if (this.xhr.status >= 200 && this.xhr.status < 300) {
                    this.block.responseList[this.block.sendIndex] = this.xhr.response;
                }
            }
            if (this.xhr.readyState == 4) {
                if (this.xhr.status >= 200 && this.xhr.status < 300) {
                    console.log(this.blockInfo, "OnEnd");
                    this.OnEnd();
                }
                else {
                    console.warn(this.blockInfo, "HRange 请求文件失败", " readyState=" + this.xhr.readyState, " status=" + this.xhr.status, "response=", this.xhr.response);
                    this.Request(this.block, true);
                    console.log(this.block);
                }
            }
        }
        onprogress(e) {
            this.block.progressList[this.block.sendIndex] = e.loaded;
            console.log(this.blockInfo, "onprogress", e.loaded, e.total, Math.ceil(e.loaded / e.total * 100) + "%");
        }
        onabort() {
            console.warn(this.blockInfo, "onabort");
            this.OnEnd(true);
        }
        onerror(e) {
            console.error(this.blockInfo, e);
        }
        OnEnd(isAbort) {
            this.block.OnEnd(isAbort);
            this.block = null;
            if (!isAbort) {
                this.xhr.abort();
            }
            HRange.RecoverItem(this);
        }
        Request(block, isError) {
            if (isError) {
                if (!block.responseList[block.sendIndex]) {
                    block.progressList[block.sendIndex] = 0;
                }
                else {
                    block.sendIndex++;
                }
            }
            else {
                block.sendIndex++;
            }
            this.block = block;
            this.xhr.abort();
            this.xhr.responseType = block.fileTask.responseType;
            this.xhr.open("get", block.fileTask.url, true);
            this.xhr.setRequestHeader("Range", `bytes=${block.rangeBegin}-${block.end}`);
            this.xhr.setRequestHeader("content-type", "application/octet-stream");
            this.xhr.send();
            console.log(this.blockInfo, "HRRange.Request");
        }
        Abort() {
            this.xhr.abort();
        }
        static GetItem() {
            if (this.pool.length > 0) {
                return this.pool.shift();
            }
            else {
                if (this.currNum < this.MaxNum) {
                    this.currNum++;
                    return new HRange();
                }
                else {
                    return null;
                }
            }
        }
        static RecoverItem(item) {
            if (this.wait.length > 0) {
                let waitItem = this.wait.shift();
                item.Request(waitItem);
            }
            else {
                if (this.pool.indexOf(item) == -1) {
                    this.pool.push(item);
                }
            }
        }
        static Request(bolck) {
            let item = this.GetItem();
            if (item) {
                item.Request(bolck);
            }
            else {
                this.wait.push(bolck);
            }
        }
    }
    HRange.MaxNum = 2;
    HRange.currNum = 0;
    HRange.pool = [];
    HRange.wait = [];

    class FileBlock {
        constructor() {
            this.index = 0;
            this.begin = 0;
            this.end = 0;
            this.responseList = [];
            this.progressList = [];
            this.sendIndex = -1;
            this._isAbort = false;
            this._isComplete = false;
        }
        get rangeBegin() {
            return this.begin + this.loadedSize;
        }
        get loadedSize() {
            var v = 0;
            for (var i = 0, len = this.progressList.length; i < len; i++) {
                v += this.progressList[i];
            }
            for (var i = 0, len = this.responseList.length; i < len; i++) {
                if (!this.responseList[i]) {
                    continue;
                }
                console.log(this.responseList[i]);
                console.log(this.responseList[i].byteLength);
            }
            return v;
        }
        Reset() {
            this.fileTask = null;
            this.begin = 0;
            this.end = 0;
            this.responseList.length = 0;
            this.progressList.length = 1;
            this.progressList[0] = 0;
            this.sendIndex = -1;
            this._isAbort = false;
            this._isComplete = false;
        }
        get isAbort() {
            return this._isAbort;
        }
        get isComplete() {
            return this._isComplete;
        }
        OnEnd(isAbort) {
            this._isAbort = isAbort;
            this._isComplete = this.loadedSize == this.end;
            this.fileTask.OnBlockEnd(this);
        }
        MergeToBuff(buff) {
            var offset = this.begin;
            for (var i = 0, len = this.responseList.length; i < len; i++) {
                var item = this.responseList[i];
                var itemBuff = new Int8Array(item);
                buff.set(itemBuff, offset);
                offset += item.byteLength;
            }
        }
        static PoolGetItem() {
            var item;
            if (this.pool.length > 0) {
                item = this.pool.shift();
            }
            else {
                item = new FileBlock();
            }
            item.Reset();
            return item;
        }
        static PoolRecoverItem(item) {
            if (this.pool.indexOf(item) == -1) {
                return this.pool.push(item);
            }
        }
    }
    FileBlock.pool = [];

    class FileTask {
        constructor() {
            this.responseType = "";
            this.isEndRecoverBlockList = false;
            this.isEndRecover = false;
            this.blockList = [];
            this.blockEndCount = 0;
        }
        RequestSize() {
            HRHead.RequestSize(this.url, this.OnGetSize, this);
        }
        OnGetSize(error, fileSize, url) {
            if (!error) {
                this.totalSize = fileSize;
                this.SpliteBlock();
                this.RequestBlocksList();
            }
        }
        RequestBlocksList() {
            this.blockEndCount = 0;
            for (var block of this.blockList) {
                if (block.isComplete) {
                    this.blockEndCount++;
                }
                else {
                    HRange.Request(block);
                }
            }
            if (this.blockEndCount >= this.blockList.length) {
                this.onEnd();
            }
        }
        SpliteBlock() {
            var size = this.totalSize;
            var ProcessorCount = FileTask.MaxBlockNum;
            var singleTmpFileSize = FileTask.singleTmpFileSize;
            var blockList = this.blockList;
            var blockSize = Math.floor(size / ProcessorCount);
            var modSize = this.totalSize % ProcessorCount;
            var block;
            if (size < singleTmpFileSize) {
                block = FileBlock.PoolGetItem();
                block.fileTask = this;
                block.index = 0;
                block.begin = 0;
                block.end = size - 1;
                blockList.push(block);
            }
            else {
                for (var i = 0; i < ProcessorCount; i++) {
                    block = FileBlock.PoolGetItem();
                    block.fileTask = this;
                    block.index = i;
                    block.begin = i * blockSize;
                    block.end = (i + 1) * blockSize - 1;
                    if (i == ProcessorCount - 1) {
                        block.end += modSize;
                    }
                    blockList.push(block);
                }
            }
            console.log("blockList.length=", blockList.length);
        }
        Start(url, responseType = "arraybuffer") {
            this.url = url;
            this.responseType = responseType;
            this.RequestSize();
        }
        OnBlockEnd(block) {
            this.blockEndCount++;
            if (this.blockEndCount >= this.blockList.length) {
                this.onEnd();
            }
        }
        onEnd() {
            this.Merge();
            if (this.callbackFun) {
                if (this.callbackObj) {
                    this.callbackFun.call(this.callbackObj, this.response, this.url);
                }
                else {
                    this.callbackFun(this.response, this.url);
                }
            }
            if (this.isEndRecoverBlockList) {
                this.RecoverBlockList();
            }
            if (this.isEndRecover) {
                this.PoolRecoverItem();
            }
        }
        RecoverBlockList() {
            for (var i = 0, len = this.blockList.length; i < len; i++) {
                var block = this.blockList[i];
                FileBlock.PoolRecoverItem(block);
            }
            this.blockList.length = 0;
        }
        Merge() {
            if (this.responseType == "arraybuffer" || this.responseType == "moz-chunked-arraybuffer" || this.responseType == "ms-stream") {
                this.MergeArrayBuffer();
            }
            else {
                this.MergeText();
            }
        }
        MergeArrayBuffer() {
            if (this.blockList.length == 1 && this.blockList[0].responseList.length == 1) {
                this.response = this.blockList[0].responseList[0];
            }
            else {
                var arr = new ArrayBuffer(this.totalSize);
                var buff = new Int8Array(arr);
                for (var i = 0, len = this.blockList.length; i < len; i++) {
                    var block = this.blockList[i];
                    block.MergeToBuff(buff);
                }
                this.response = arr;
            }
        }
        MergeText() {
            if (this.blockList.length == 1 && this.blockList[0].responseList.length == 1) {
                this.response = this.blockList[0].responseList[0];
            }
            else {
                var arr = [];
                for (var i = 0, len = this.blockList.length; i < len; i++) {
                    var block = this.blockList[i];
                    arr.push(...block.responseList);
                }
                this.response = arr.join();
            }
        }
        PoolRecoverItem() {
            this.url = null;
            this.totalSize = 0;
            this.responseType = "";
            this.response = null;
            this.isEndRecoverBlockList = false;
            this.isEndRecover = false;
            this.RecoverBlockList();
            this.blockEndCount = 0;
            this.callbackFun = null;
            this.callbackObj = null;
            FileTask.RecoverItem(this);
        }
        static GetItem() {
            if (this.pool.length > 0) {
                return this.pool.shift();
            }
            else {
                return new FileTask();
            }
        }
        static RecoverItem(item) {
            if (this.pool.indexOf(item) == -1) {
                this.pool.push(item);
            }
        }
        static Request(url, callbackFun, callbackObj, responseType = "arraybuffer", isEndRecoverBlockList = true, isEndRecover = true) {
            let item = this.GetItem();
            item.callbackFun = callbackFun;
            item.callbackObj = callbackObj;
            item.isEndRecoverBlockList = isEndRecoverBlockList;
            item.isEndRecover = isEndRecover;
            item.Start(url, responseType);
            return item;
        }
    }
    FileTask.MaxBlockNum = 2;
    FileTask.singleTmpFileSize = 1024;
    FileTask.pool = [];
    window['FileTask'] = FileTask;
    window['FileBlock'] = FileBlock;
    window['HRHead'] = HRHead;
    window['HRange'] = HRange;

    class TestMain {
        constructor() {
            this.fileResponseObj = {};
            this.InitLaya();
            if (Laya.Browser.onWeiXin) {
                Laya.URL.basePath = "http://192.168.1.8:8901/bin/";
            }
            var urlList = [
                "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Scene_PVE_001_003-2d24d048b9.zip",
                "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/UnityBuiltin-bb6d87a30c.zip",
                "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Hero_1001_Dianguanglongqi_Skin1-92eee2d8ca.zip",
                "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Monster_2003_langyabing_Skin1-ef9a8b4b9a.zip",
                "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Monster_2012_Laohu_Skin1-0a28ac8ce7.zip",
                "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Monster_4001_Fujiang_Skin1-19b9eff80d.zip",
                "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Effect_1001_Dianguanglongqi_Skin1-803555b774.zip",
                "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Effect_1001_Dianguanglongqi_Skin1____Effect_1002_Fengyunzhanji_Skin1____Effect_1004_Dongzhuo_Skin1-957180163b.zip",
                "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Effect_1001_Dianguanglongqi_Skin1____Effect_1002_Fengyunzhanji_Skin1____Effect_1004_Dongzhuo_Skin1-957180163b.zip",
                "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Effect_1001_Dianguanglongqi_Skin1____Effect_1004_Dongzhuo_Skin1-f1fe61b0c6.zip",
                "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Assets___GameArt___Effect-7dce0d45c5.zip",
                "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Effect_2003_langyabing_Skin1-aac9fb443d.zip",
                "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Effect_000_BehitCommon-4f9cec9d90.zip",
                "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/general_impact_02-2c70e910ba.zip",
                "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Effect_Text_Forward-e83d2b6598.zip",
                "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Assets-dcef28f04b.zip",
                "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Effect_Text_Arrow-daf449a333.zip",
                "https://h5-jjsg-cdn6.123u.com/testlaya/web_01_00_00_54/res3dzip/Effect_000_Circle-bac4045cd4.zip"
            ];
            HRHead.MaxNum = 5;
            HRange.MaxNum = 5;
            for (var url of urlList) {
                Laya.loader.load(url, Laya.Handler.create(this, this.onLayaLoad, [url]), null, Laya.Loader.BUFFER);
            }
            window['testMain'] = this;
        }
        onLayaLoad(response, url) {
            console.log(url);
            console.log(response);
            this.fileResponseObj[url] = response;
        }
        onFileEnd(response, url) {
            console.log(url);
            console.log(response);
            this.fileResponseObj[url] = response;
        }
        onFileSize(error, fileSize, url) {
            console.log("error:", error, "fileSize:", fileSize, ",", bToStr(fileSize), "url:", url);
        }
        ab2str(u, f) {
            var b = new Blob([u]);
            var r = new FileReader();
            r.readAsText(b, 'utf-8');
            r.onload = function () { if (f)
                f.call(null, r.result); };
        }
        str2ab(s, f) {
            var b = new Blob([s], { type: 'text/plain' });
            var r = new FileReader();
            r.readAsArrayBuffer(b);
            r.onload = function () { if (f)
                f.call(null, r.result); };
        }
        InitLaya() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            Laya.Shader3D.debugMode = true;
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
        }
    }
    new TestMain();

}());
//# sourceMappingURL=bundle.js.map
