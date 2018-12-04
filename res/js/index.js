let videoCounter = 0;
let selectedCoord = 0;
let FWDOn = 0;
let xbutton = document.getElementById("Xbutton");
let zbutton = document.getElementById("Zbutton");
let FWDbutton = document.getElementById("FWD");


xbutton.addEventListener("click", function() {
	selectedCoord = 1;
	xbutton.style.backgroundColor = "rgb(0,0,0)";
	zbutton.style.backgroundColor = "rgb(85,80,74)";
	console.log("X coord");
});

zbutton.addEventListener("click", function() {
	selectedCoord = 2;
	zbutton.style.backgroundColor = "rgb(0,0,0)";
	xbutton.style.backgroundColor = "rgb(236,210,175)";
	console.log("Y coord");
});

function numberPressed(element){
	let buffer = document.getElementById('coord-buffer');
	buffer.value = addNumber(buffer.value, element.value);
}

function addNumber(current, digit) {
	// TODO: actually add the calculator function
	return current + digit;
}

function setAbsPos(element) {
	let buffer = document.getElementById('coord-buffer');
	if (selectedCoord == 1) {
		let xvar = document.getElementById('xvar');
		if (element.value === "RESTORE") {
			xvar.value = "";
		} else {
			if (buffer.value.length <= 0) return;
			xvar.value = buffer.value;
			buffer.value = "";
		}
	} else if (selectedCoord == 2) {
		let zvar = document.getElementById('zvar');
		if (element.value === "RESTORE") {
			zvar.value = "";
		} else {
			if (buffer.value.length <= 0) return;
			zvar.value = buffer.value;
			buffer.value = "";
		}
	}
}

function switchVideo(element) {
	videoCounter += 1;
	let video_1 = document.getElementById("videoList_1");
	let video_2 = document.getElementById("videoList_2");
	let video_3 = document.getElementById("videoList_3");
	let video_4 = document.getElementById("videoList_4");
	let video_5 = document.getElementById("videoList_5");
	let video_end = document.getElementById("videoList_end");

	if (videoCounter == 1) {
		video_1.style.display = "block";
	} else if (videoCounter == 2) {
		video_2.style.display = "block";
		video_1.style.display = "none"
	} else if (videoCounter == 3) {
		video_3.style.display = "block";
		video_2.style.display = "none"
	} else if (videoCounter == 4) {
		video_4.style.display = "block";
		video_3.style.display = "none";
	} else if (videoCounter == 5) {
		video_5.style.display = "block";
		video_4.style.display = "none";

	} else if (videoCounter == 6) {
		video_end.style.display = "block";
		video_5.style.display = "none";
	}
}

window.addEventListener('DOMContentLoaded', function(){
		var canvas = document.getElementById('canvas');
		var engine = new BABYLON.Engine(canvas, true);
		engine.enableOfflineSupport = false;

		var createScene = function(){
				var scene = new BABYLON.Scene(engine);
				scene.clearColor = new BABYLON.Color3.White();
				var box2 = BABYLON.Mesh.CreateBox("Box2",4,scene);
				var material = new BABYLON.StandardMaterial("material1",scene);
				var wheel;
				var wheel2;
				// Ground
				var ground = BABYLON.Mesh.CreateGround("ground", 100, 100, 1, scene, false);
				ground.position.y = -.01;

				BABYLON.SceneLoader.ImportMesh("","","untitled.babylon",
				scene,function(newMeshes) {
						wheel2 = newMeshes[0];
						wheel2.position = new BABYLON.Vector3(-15,2,-5);
				});

				BABYLON.SceneLoader.ImportMesh("","","untitled.babylon",
				scene,function(newMeshes) {
						wheel = newMeshes[0];
						var startingPoint;
						var currentMesh;
						var dragInit;
						var dragDiff;
						var rotationInit;
						wheel.position = new BABYLON.Vector3(-15,2,-0);
						var getGroundPosition = function () {
							// Use a predicate to get position on the ground
							var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == ground; });
							if (pickinfo.hit) {
								return pickinfo.pickedPoint;
							}

							return null;
						}

						var onPointerDown = function (e) {
							if (e.button !== 0) {
								return;
							}

							if (parseInt(navigator.appVersion)>3) {
								var evt = e ? e:window.event;
								dragInit = { x: evt.x, y: evt.y };
							// check if we clicked on a mesh
								var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh !== ground; });
								if (pickInfo.hit &&  (pickInfo.pickedMesh == wheel || pickInfo.pickedMesh == wheel2)) {
									currentMesh = pickInfo.pickedMesh;
									console.log(pickInfo.pickedMesh);
									startingPoint = getGroundPosition(evt);
									rotationInit = currentMesh.rotation.y;
									if (startingPoint) { // we need to disconnect camera from canvas
										setTimeout( function () {camera.detachControl(canvas)}, 0 );
									}
								}
							}
						};

						// ----------------------------------------------------------------------------
						var onPointerUp = function (evt) {
							if (startingPoint) {
								camera.attachControl(canvas, true);
								startingPoint = null;
								return;
							}
						}

						// ----------------------------------------------------------------------------
						var onPointerMove = function (evt) {
							if (!startingPoint) {
								return;
							}
							var current = getGroundPosition(evt);

							if (!current) {
								return;
							}

							dragDiff = {
								x: evt.x - dragInit.x,
								y: evt.y - dragInit.y
							}

							currentMeshX = currentMesh.rotation.x ;
							var newRotation = rotationInit - dragDiff.x / 170;
							currentMesh.rotation.x = newRotation;
							console.log(currentMesh.rotation);
							if(currentMesh.rotation.x>currentMeshX){
								if (currentMesh == wheel){
									box2.position.z+=0.1;
								}
								else if (currentMesh == wheel2) {
									box2.position.x+=0.1;
								}

							}
							else if (currentMesh.rotation.x<currentMeshX) {
								if (currentMesh == wheel){
									box2.position.z-=0.1;
								}
								else if (currentMesh == wheel2) {
									box2.position.x-=0.1;
								}
							}

							return true;
						}
						// ----------------------------------------------------------------------------
						canvas.addEventListener("pointerdown", onPointerDown, false);
						canvas.addEventListener("pointerup", onPointerUp, false);
						canvas.addEventListener("pointermove", onPointerMove, false);

				});



				material.wireframe = true;
				var box1 = BABYLON.Mesh.CreateBox("Box1",4,scene);
				box1.position = new BABYLON.Vector3(-5,2,-0);
				box2.material = material;
				box2.position = new BABYLON.Vector3(-5,2,-10);


				// var light = new BABYLON.PointLight("pointlight",new BABYLON.Vector3(0,10,0),scene);
				// light.parent = camera;
				// light.diffuse = new BABYLON.Color3(1,1,1);
				var light2 = new BABYLON.PointLight("pointlight",new BABYLON.Vector3(-25,10,0),scene);
				light2.diffuse = new BABYLON.Color3(1,1,1);
        var camera = new BABYLON.ArcRotateCamera("Camera", -2.3, 1.1, 30, new BABYLON.Vector3.Zero(), scene);
				camera.setPosition(new BABYLON.Vector3(-30, 10, -5));
				camera.attachControl(canvas,true);




				var frameRate = 10;

				//Rotation Animation
				var yRot = new BABYLON.Animation("yRot", "rotation.z", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

			  var keyFramesR = [];

			  keyFramesR.push({
						frame: 0,
						value: 0
			  });

				keyFramesR.push({
						frame: frameRate,
						value: 4 * Math.PI
			  });

				keyFramesR.push({
						frame: 2 * frameRate,
						value: 8 * Math.PI
			  });
			  yRot.setKeys(keyFramesR);

				var fwdOn = 0;
				var music = new BABYLON.Sound("FWDSound", "res/sounds/5959.mp3", scene, null, { loop: true, autoplay: false });
				document.getElementById("FWD").addEventListener("click",function () {
					 if(fwdOn){
						 scene.stopAnimation(box1);
						 music.stop();
						 fwdOn = 0;
					 }
					 else{
						 scene.beginDirectAnimation(box1, [yRot], 0, 2 * frameRate, true);
						 music.play();
						 fwdOn = 1;
					 }
				 });
				return scene;
		}

		var scene = createScene();
		engine.runRenderLoop(function(){
				scene.render();
		});

});
