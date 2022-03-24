<template>
    <div>
<!-- 面包屑导航区 -->
<el-breadcrumb separator-class="el-icon-arrow-right">
           <!-- path点击会去/home -->
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  
</el-breadcrumb>

<!-- 卡片 -->
<el-card>
    <el-table :data="rightsLists">
         <el-table-column label="索引" type="index"></el-table-column>     
        <el-table-column label=" 权限名称" prop="authName" >  </el-table-column>
        <el-table-column label=" 路径" prop="path" >  </el-table-column>
        <el-table-column label=" 权限等级" prop="level" > 
            <!-- 自定义样式，插槽 ,scope接受这行数据-->
            <template slot-scope="scope">
                <el-tag v-if="scope.row.level==='0'">一级权限</el-tag>
                <el-tag type="success" v-if="scope.row.level==='1'">二级权限</el-tag>
                <el-tag type="warning" v-if="scope.row.level==='2'">三级权限</el-tag>

            </template>
        </el-table-column>


    </el-table>


</el-card>

    </div>
</template>

<script>
export default {
    data(  ){

        return{

            // 权限列表
            rightsLists:[]
        }
    
 
 },

created(){

    // 获取所有权限
    this.getRightsList()

},

methods:{
    
    // 获取所有权限列表
    async getRightsList(){
        // type值写死list类型，tree型不写
      const {data:res}= await this.$http.get('rights/list')
      if(res.meta.status!==200){
          return this.$message.error('获取权限列表失败')
      }

    //   获取的数据挂载到data的rightLists中
    this.rightsLists=res.data   
    console.log(this.rightsLists)

    }





}





}

</script>

<style lang="less" scoped>

</style>

