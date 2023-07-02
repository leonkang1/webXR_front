<template>
    <div class="home-top">
        <div class="home-info">
            {{ task_info }}
        </div>
        <div v-if="is_game_active" class="home-view">
            <img :src="img_url" class="home-img"/>
        </div>
        <div v-else class="home-start-btn-container">
            <el-button type="plain" @click="startGame()"> Start Game </el-button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default{
    mounted(){
        window.addEventListener('keydown', this.handleKeyDown);
    },
    destroyed() {
        window.removeEventListener('keydown', this.handleKeyDown);
        clearInterval(this.get_rgb_pic_timer);
        clearInterval(this.get_episode_status_timer);
    },
    data(){
        return{
            session_id: 1,
            img_url: "",
            is_game_active: false,
            get_rgb_pic_timer: null,
            task_info: "",
            get_episode_status_timer: null,
        }
    },
    methods:{
        async handleKeyDown(event){
            console.log("key", event.key);
            const {data:res} = await axios.post(
                "/api/post_action", {"session_id": this.session_id, "action": event.key}
            );
        },
        getRgbPic(){
            axios.get(
                "/api/get_rgb_observation", {
                    params: {"session_id": this.session_id},
                    responseType: "blob"
                }
            ).then(response=>{
                console.log("response", response.data);
                const reader = new FileReader();
                reader.onloadend = () =>{
                    this.img_url = reader.result;
                };
                reader.readAsDataURL(response.data);
            })  
            .catch(error => {
            console.error('获取图片失败:', error);
            // 处理错误
            });
        },
        async startGame(){
            const {data:res} = await axios.post("/api/start_episode", {
                params: {"session_id": this.session_id}
            });
            if (res.status == 200){
                this.is_game_active = true;
                this.get_rgb_pic_timer = setInterval(this.getRgbPic, 500);   
                this.get_episode_status_timer = setInterval(this.getEpisodeStatus, 500);
                this.task_info = "Task going on";          
            } else {
                this.$message.error("start game fail");
            }
        },
        async getEpisodeStatus(){
            const {data:res} = await axios.get("/api/get_episode_status", {
                params: {"session_id": this.session_id}
            });
            console.log("res", res);
            if (res.is_active == false){
                if (res.is_success){
                    this.task_info = "Task succeeded"
                } else {
                    this.task_info = "Task failed";
                }

                this.is_game_active = false;

                clearInterval(this.get_rgb_pic_timer);
                clearInterval(this.get_episode_status_timer);
            }
        }
    }
}

</script>

<style scoped>
.home-view{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 60vw;
    height: 50vh;
}

.home-img{
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.home-start-btn-container{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>