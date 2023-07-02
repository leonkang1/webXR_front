<template>
    <div class="home-top">
        <div class="home-view">
            <img :src="img_url" class="home-img"/>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default{
    mounted(){
        window.addEventListener('keydown', this.handleKeyDown);
        this.get_rgb_pic();
        setInterval(this.get_rgb_pic, 500); 
    },
    destroyed() {
        window.removeEventListener('keydown', this.handleKeyDown);
    },
    data(){
        return{
            session_id: 1,
            img_url: ""
        }
    },
    methods:{
        async handleKeyDown(event){
            console.log("key", event.key);
            const {data:res} = await axios.post(
                "/api/post_action", {"session_id": this.session_id, "action": event.key}
            );
        },
        get_rgb_pic(){
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
</style>