import { SpineObject } from "./SpineObject"
import { Constants } from "./Constants"
import { State } from "./State"
import { Bullet } from "./Bullet"
export class Boy extends SpineObject {
    cursors: Phaser.Types.Input.Keyboard.CursorKeys
    state: State
    bullets: Phaser.GameObjects.Group
    lastShotTime: number
    constructor(scene: Phaser.Scene, x: number, y: number, key?: string, animationName?: string, loop?: boolean) {
        super(scene, x, y, key, animationName, loop)

        this.state = State.Run

        this.spine
            .setDepth(Constants.Boy.depth)

        this.setScale(Constants.Boy.scale)

        //physics
        this.initPhysics()

        //Control
        this.initControl()

        //Bullet group
        this.initBullet()

        this.spine.play('idle', true, true)

        //this.body.setVelocityX(Constants.Boy.runSpeed)

    }

    initBullet(){
        this.lastShotTime=this.scene.time.now

        this.bullets=this.scene.physics.add.group({
            classType:Bullet
        })
        // {
        //     classType:Bullet,
        //     maxSize:Constants.Boy.maxBullet
        // })

        // this.bullets.createMultiple({
        //     classType:Bullet,
        //     key:'texture',
        //     frame:'syringe.png',
        //     quantity:Constants.Boy.maxBullet,
        //     //visible:true,
        //     //active:false,
        //     setDepth:{value:1}
        // })
    }

    initControl() {
        this.cursors = this.scene.input.keyboard.createCursorKeys()
    }
    initPhysics() {
        //@ts-ignore
        this.body.setGravityY(Constants.Boy.gravityY).setCollideWorldBounds()
    }

    jumpUp() {
        //@ts-ignore
        // this.scene.midgroundLayerCollider.active = false
        // this.scene.time.delayedCall(Constants.Platform.colliderDisableTime, () => {
        //     //@ts-ignore
        //     this.scene.midgroundLayerCollider.active = true
        // })
        //@ts-ignore
        this.body.setVelocityY(-Constants.Boy.jumpSpeed)

        this.spine.play('jump', true, true)
    }

    goLeft(delta:number) {
        //@ts-ignore
        this.body.setVelocityX(-Constants.Boy.runSpeed)

        //@ts-ignore
        //this.scene.groundLayer.x+=Constants.Boy.runSpeed*delta/1000
        //@ts-ignore
        //this.scene.midgroundLayer.x+=Constants.Boy.runSpeed*delta/1000
        //@ts-ignore
        //this.scene.background.tilePositionX-=Constants.Boy.runSpeed*delta/1000/this.scene.background.scale
        //@ts-ignore
        // this.scene.viruses.getChildren().forEach(virus=>{
        //     virus.x+=Constants.Boy.runSpeed*delta/1000
        // })

        //@ts-ignore
        if (this.body.onFloor()) {

            this.spine.play('run', true, true)
        }
        this.setFlipX(true)
    }


    goRight(delta:number) {
        //@ts-ignore
        this.body.setVelocityX(Constants.Boy.runSpeed)

        //@ts-ignore
        //this.scene.groundLayer.x-=Constants.Boy.runSpeed*delta/1000
        //@ts-ignore
        //this.scene.midgroundLayer.x-=Constants.Boy.runSpeed*delta/1000
        //@ts-ignore
        //this.scene.background.tilePositionX+=Constants.Boy.runSpeed*Constants.background.paralax*delta/1000/this.scene.background.scale
        //@ts-ignore
        // this.scene.viruses.getChildren().forEach(virus=>{
        //     virus.x-=Constants.Boy.runSpeed*delta/1000
        // })
        //@ts-ignore
        if (this.body.onFloor()) {

            this.spine.play('run', true, true)
        }
        this.setFlipX(false)
    }

    dropDown() {
        //@ts-ignore
        // this.scene.midgroundLayerCollider.active = false
        // this.scene.time.delayedCall(Constants.Platform.colliderDisableTime, () => {
        //     //@ts-ignore
        //     this.scene.midgroundLayerCollider.active = true
        // })
        this.body.setVelocityY(Constants.Boy.dropDownSpeed)

        this.spine.play('jump', true, true)
    }

    shoot(time:number){
        if (time-this.lastShotTime>=1000/Constants.Boy.rateOfFire){
            this.lastShotTime=time
            var bullet=this.bullets.get(this.body.x,this.body.y,'texture','syringe.png')
            if (bullet){
                bullet.reset(this.body.x+this.body.width*Constants.Boy.gunOffset.x,this.body.y+this.body.width*Constants.Boy.gunOffset.y)
                if(this.body.x<=this.scene.input.activePointer.worldX){
                    this.setFlipX(false)
                }
                else{
                    this.setFlipX(true)
                }
                bullet.shoot({
                    x:this.scene.input.activePointer.worldX,
                    y:this.scene.input.activePointer.worldY
                })
            }
        }
    }

    infected(){
        console.log('infected')
    }

    update(time:number,delta:number) {
        switch (this.state) {
            case State.Run:
                //@ts-ignore
                if (this.body.onFloor() && !this.cursors.left.isDown && !this.cursors.right.isDown) {

                    this.spine.play('idle', true, true)
                }
                //@ts-ignore
                // if (!this.body.onFloor()) {
                //     
                //     this.spine.play('jump', true, true)
                // }
                //@ts-ignore
                if (this.cursors.up.isDown && this.body.onFloor()) {
                    this.jumpUp()
                }
                // else if (this.body.onFloor()){
                //     this.spine.play('run',true,true)
                // }
                // else if (this.cursors.down.isDown && this.body.onFloor()) {
                //     this.dropDown()
                // }
                if (this.cursors.left.isDown) {
                    this.goLeft(delta)
                }
                else if (this.cursors.right.isDown) {
                    this.goRight(delta)
                }
                else {
                    //@ts-ignore
                    this.body.setVelocityX(0)
                }
                if (this.scene.input.activePointer.isDown){
                    this.shoot(time)
                }
                break
            default:
                break
        }

    }
}