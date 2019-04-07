import ObjLoader from 'obj-mtl-loader';
import {vec3} from 'gl-matrix';

import {encodeObjModelTriangleVertexData} from '../../model-encoders/obj';

import {
    range,
    defined,
    definedNotNull,
    normedColor,
    isHexColor,
    glslFloat
} from '../../utils';

class ObjModel {
    includeInBvh = true;

    constructor({url, scale, position, rotation, material}) {
        this.url = url;
        this.material = material;
        this._triangleData = null;

        this.scale = defined(scale)
            ? scale
            : 1;

        this.position = {
            x: 0,
            y: 0,
            z: 0,
            ...(defined(position)
                ? position
                : [])
        };

        this.rotation = {
            x: 0,
            y: 0,
            z: 0,
            ...(defined(rotation)
                ? rotation
                : [])
        };

        return (async () => {
            this.mesh = await this.loadModel();
            return this;
        })();
    }

    get triangleData() {
        if(!this._triangleData) {
            this._triangleData = encodeObjModelTriangleVertexData({
                mesh: this.mesh,
                scale: this.scale,
                position: this.position,
                rotation: this.rotation,
                materialId: this.material.materialId
            });
        }

        return this._triangleData;
    }

    async loadModel() {
        return new Promise((resolve, reject) => {
            const objLoader = new ObjLoader();
            objLoader.load(this.url, (err, mesh) => {
                if(definedNotNull(err)) {
                    reject(err);
                }

                resolve(mesh);
            });
        });
    }
}

export default ObjModel;