'use strict';
class Graphic {
  constructor() {

  }
  static createImage (x,y,z,rotation,img_src){
    let i1, i2;
    i1 = THREE.ImageUtils.loadTexture(img_src, undefined, function ( tex1 ) {
    i2 = THREE.ImageUtils.loadTexture(img_src, undefined, function ( tex2 ) {});
    });

    let material = new THREE.MeshBasicMaterial( {map: i1, side:THREE.DoubleSide} );

    material.transparent = true;

    let mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(64,64), material);
    mesh.position.set(x, y+69, z);
    mesh.rotation.y = rotation;
    objects.push(mesh);
    scene.add(mesh);
    group.add(mesh);
    return mesh;
  }
  static createSphere (x, y, z, r, opacity){
    let geometry = new THREE.SphereGeometry(r, 32, 32 );
    let material = new THREE.MeshPhongMaterial( {color: user.sphereColor,transparent:true, opacity:opacity} );
    let sphere = new THREE.Mesh( geometry, material );
    sphere.position.set(x, y+100, z);
    objects.push(sphere);
    scene.add(sphere);
    group.add(sphere);
    return sphere;
  }
  static createMark (x, y, z){
    let geometry = new THREE.SphereGeometry(5,32,32);
    let material = new THREE.MeshBasicMaterial({color:user.selectColor, transparent:true, opacity:1});
    let mark = new THREE.Mesh(geometry,material);
    mark.position.set(x, y + 85, z);
    objects.push(mark);
    scene.add(mark);
    group.add(mark);
    return mark;
  }
  static createPlane (tamano,x,y,z,rotation){
    tamano += tamano*0.25;
    if (tamano < 16) {
      tamano = 16;
    } else if (tamano > 100){
      tamano = 100;
    };
    let geometry = new THREE.PlaneBufferGeometry(64,tamano,32 );
    let material = new THREE.MeshBasicMaterial( {color: 0x5940ff, side: THREE.DoubleSide} );
    let plane = new THREE.Mesh( geometry, material );
    plane.rotation.y = rotation;
    plane.position.set(x,y+(43-(0.5 * tamano)),z);
    objects.push(plane);
    scene.add(plane);
    group.add(plane);
    return plane;

  }
  static createCone (x, y, z, r,opacity){
    console.log(r);
    let geometry = new THREE.CylinderGeometry(  0, r, 100, 50, 50, false);
    let material = new THREE.MeshLambertMaterial({color:user.defaultColor, transparent:true, opacity:opacity});//, transparent:true, opacity:opacity
    let cylinder = new THREE.Mesh( geometry, material );
    cylinder.position.x = x;
    cylinder.position.y = y;
    cylinder.position.z = z;
    objects.push(cylinder);
    scene.add(cylinder);
    group.add(cylinder);
    return cylinder;
  }
  static updateGroupGeometry( mesh, geometry ) {
    mesh.children[ 0 ].geometry.dispose();
    mesh.children[ 1 ].geometry.dispose();

    mesh.children[ 0 ].geometry = new THREE.WireframeGeometry( geometry );
    mesh.children[ 1 ].geometry = geometry;

  }
  //plane.position.set(x,y+(43-(0.5 * tamano)),z);
  static updatePosition(mesh, x, y, z){
      mesh.position.set(x, y, z);
  }
  static deleteElements(){
    while(subGroup.children.length > 0){
      var index =objects.indexOf(subGroup.children[0]);
      objects.splice(index,1);
      subGroup.remove(subGroup.children[0]);
    }
    while(group.children.length > 0){
      var index =objects.indexOf(group.children[0]);
      objects.splice(index,1);
      group.remove(group.children[0]);
    }
    objects = [];
  };
}
