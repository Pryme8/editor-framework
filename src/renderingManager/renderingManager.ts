import {Engine, Scene, FreeCamera, EngineView, Vector3, Nullable} from '@babylonjs/core'

export interface IRenderManagerScene{
    uid: string
    canvasId: string
    active : boolean
    initialized: boolean
    onInit: Nullable<Function>
    context : Scene
    view : Nullable<EngineView>
}

export class RenderingManager{    
    private _engine:Engine
    private _woringCanvas: HTMLCanvasElement = document.createElement('canvas')
    get engine():Engine{
        return this._engine
    }

    private _scenes: Map<'string', IRenderManagerScene> = new Map<'string', IRenderManagerScene>()

    constructor(private params){
        this._engine = new Engine(this._woringCanvas, false) 
        this._engine.runRenderLoop(()=>{
            this._renderLoop()
        })
    }

    private _renderLoop(){
        this._scenes.forEach((scene)=>{
            if(!scene.initialized){
                if(scene.onInit){
                    const onInit = scene.onInit
                    onInit()         
                }
                return false
            }
            const canvas: Nullable<HTMLCanvasElement>  = document.getElementById(`canvas-${scene.canvasId}`) as HTMLCanvasElement
            if(scene.view === null && canvas){ 
                scene.view = this.engine.registerView(canvas, scene.context.cameras[0])                                        
            } 
            if(this.engine.activeView === scene.view){
                scene.context.render() 
            }
        })        
    }

    public createScene(params){
        const context = new Scene(this.engine)
        new FreeCamera('camera', new Vector3(0,0,-1), context);
        (context.cameras[0] as FreeCamera).setTarget(Vector3.Zero())
        this._scenes.set(params.uid, {
                uid:params.uid,
                canvasId:params.canvasId,
                active:true,
                initialized:false,
                onInit: params.onInit ?? null,
                context,
                view : null
            }
        )
    }
    public getScene(uid){
        return this._scenes.get(uid)
    }
}