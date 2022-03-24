<template>
    <div>
       <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
           <!-- path点击会去/home -->
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  
   </el-breadcrumb>

<!-- 卡片视图区 -->
<el-card >

 
    <!-- 设置固定长度,span为长度值 , :gutter="20"两列间距-->
  <el-row  :gutter="20">
    <el-col :span="9"> 
            <!-- 搜索与添加区 -->
            <!-- v-model="queryInfo.query"绑定query，clearable 清空文本框,因为清空还停留在搜索结果中，
            所以要注册@clear事件实现getUserList()重新获取请求-->
       <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable
       @clear="getUserList()">
           <!-- 为搜索button绑定getUserList()事件 -->
    
           <el-button slot="append" icon="el-icon-search" @click="getUserList()" ></el-button> 
       </el-input> 
     
    </el-col>

        <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>

  </el-row>


<!--用户列表区域 -->
<!-- data绑定数据 border 边框 stripe 斑马隔行变色-->
 <el-table :data="userlist" border stripe>
     <!-- prop指向具体数据 -->
     <el-table-column label="索引" type="index"></el-table-column>     
     <el-table-column label="姓名"  prop="username"></el-table-column>
     <el-table-column label="邮箱"  prop="email"></el-table-column>
     <el-table-column label="电话"  prop="mobile"></el-table-column>
     <el-table-column label="角色"  prop="role_name"></el-table-column>
     <el-table-column label="状态"  prop="mg_state">
         <!-- scope.row对应这行数据，插槽是因为状态是布尔值无法显示 -->
         <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <!-- 绑定scope.row.mg_state数据到switch中 -->
            <!-- @change="userStateChanged()监听状态"scope.row.mg_state，改变向后台写入 -->
            <el-switch
               v-model="scope.row.mg_state"
               active-color="#13ce66"
                inactive-color="#ff4949" @change="userStateChanged(scope.row)">
             </el-switch>
         </template>
     </el-table-column>
     <el-table-column label="操作"  width="180px">
            <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <!-- 修改按钮 -->
            <!-- 传这行用户id值 -->
            <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <!-- 文字提示,:enterable="false,鼠标离开时自动隐藏 -->
                 <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                     <el-button type="warning" icon="el-icon-setting" circle size="mini" @click="setRole(scope.row)" ></el-button>
                </el-tooltip>
            
            </template>
     </el-table-column>
</el-table>

<!-- 分页区 -->
<!-- @size-change="handleSizeChange" 切换页面时函数
handleCurrentChange 页码改变时函数
current-page 当前展示几页，关联pagenum
page-sizes 几页跳
page-size 当前页显示几条
layout 显示页面布局结构，比如total-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>


<!-- 添加用户对话框 -->
<!-- :visible.sync="addDialogVisible 对话框布尔值显示与否，绑定挂在data中，绑定到addDialogVisible上 -->
<!--  @close="addDialogClose"注册取消时清空输入框事件 -->
<el-dialog
  title="添加用户"
  :visible.sync="addDialogVisible"
  width="50%"
  @close="addDialogClosed">
  <!--内容主体区 -->
  <!-- ref是给el-form起引用名称 -->
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
   <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
  
  </el-form>

  <!-- 底部区 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser()">确 定</el-button>
  </span>
</el-dialog>


<!-- 修改用户的对话框 -->
<el-dialog
  title="修改用户"
  :visible.sync="editDialogVisible"
  width="50%" @close="editDialogClosed">

  <!-- 修改用户表单 -->
  <!-- 用户名的disabled是不可更改，不能改不可传数据，所以prop不需要 -->
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" >
    <el-form-item label="用户名" >
    <el-input v-model="editForm.username" disabled></el-input>
   </el-form-item>
    <el-form-item label="邮箱"  prop="email" >
    <el-input v-model="editForm.email" ></el-input>
    </el-form-item>
    <el-form-item label="手机号" prop="mobile" >
    <el-input v-model="editForm.mobile" ></el-input>
    </el-form-item>


  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
</el-dialog>




<!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
            <!-- 选中的值通过v-model保存在selectedRoleId中 -->
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    </div>

</template>

<script>
export default {
    data(){
        // 自定义验证邮箱规则
        var checkEmail =(rule,value,cb) => {
            // 邮箱正则
            const regmail= /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if(regmail.test(value))
            {
                return cb()
            }
            cb(new Error('请输入合法邮箱'))

        
        }

        // 验证手机规则        
        var checkMobile =(rule,value,cb) => {
            // 手机正则
            const regMobile= /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
            if(regMobile.test(value))      
            {
                return cb()
            }
            cb(new Error('请输入正确手机号'))

        }

        return {
            // 获取用户列表参数对象
            queryInfo:{
                // 搜索双向绑定
                query:'',
                // 请求页码
                pagenum:'1',
                // 每页显示条数
                pagesize:'2'
            },
            userlist:[],
            total:0,

            // 控制添加用户添加对话框显示与隐藏
            addDialogVisible:false,
            // 添加用户表单对象
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:''

            },
            // 添加表单验证规则对象
            addFormRules:{
                username:[
                    {required:true,message:'请输入用户名',trigger:'blur'},
                    {min:3,max:10,message:'用户名长3-10个间',trigger:'blur'}
                ],
                 password:[
                    {required:true,message:'请输入密码',trigger:'blur'},
                    {min:6,max:10,message:'密码长6-10个间',trigger:'blur'}
                ],
                 email:[
                    {required:true,message:'请输入邮箱',trigger:'blur'},
                    {validator:checkEmail,trigger:'blur'}
                ],
                mobile:[
                    {required:true,message:'请输入手机号',trigger:'blur'},
                    {validator:checkMobile,trigger:'blur'}
                ],
            },

            // 控制修改用户对话框显示隐藏
            editDialogVisible:false,

            // 查询到的用户信息对象
            editForm:{

            },


            // 修改表单验证规则对象
            editFormRules:{
                email:[
                    {required:true,message:'请输入邮箱',trigger:'blur'},
                    {validator:checkEmail,trigger:'blur'}
                ],
                 mobile:[
                     {required:true,message:'请输入手机号',trigger:'blur'},
                    {validator:checkMobile,trigger:'blur'}
                 ]
                    
            },

            // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色Id值,select用
      selectedRoleId: ''
        }
    },
    created(){
        // 发起数据请求
        this.getUserList()
    },
    methods:{
        async getUserList(){
            // user是api请求路径,发起ajax数据请求this.queryInfo里需要的data，发起请求必然返回promise对象，为了简化必须异步,结构data给res
            const {data:res} =await this.$http.get('users',{params:this.queryInfo})
            if(res.meta.status!==200){
                return this.$message.error('获取用户列表失败')
            }
            this.userlist=res.data.users
            this.total=res.data.total
            console.log(res)
        }   ,
        // 监听pagesize改变事件
        handleSizeChange(newSize){
            // console.log(newSize)
            this.queryInfo.pagesize =newSize
            this.getUserList()
        },
        // 监听页码改变时
        handleCurrentChange(newPage){
            // console.log(newPage)
            this.queryInfo.pagenum=newPage
            this.getUserList()
        },
        //  @change="userStateChanged()监听状态"scope.row.mg_state，改变向后台写入
        async userStateChanged(userinfo){
            // console.log(userinfo)
        // axios用api向后台发送put请求进行更改：uid是用户id，state是布尔值
        // 为了可以动态改uid，修改成模板字符串，单变反引，发起请求时返回promise
        // 所以异步两个,解构给res，通过响应meta的status判断
        const {data:res}= await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        if(res.meta.status!==200) {
            // 更新失败的话恢复回去，取反
            userinfo.mg_state=!userinfo.mg_state
            return this.$message.error('更新用户状态失败')
        }
        this.$message.success('用户状态更新成功')
        

        },


        // 监听添加用户对话框的关闭事件
        addDialogClosed(){
            // 通过表单的ref引用 调用resetFields（）函数重置表单
            this.$refs.addFormRef.resetFields()
        },

       addUser(){
            // 验证添加是否成功
            this.$refs.addFormRef.validate( async valid =>{
                
                // console.log(valid)
                // 如果返回值不是true，就返回
                if(!valid) return

                // 可以发起添加用户网络请求,promise简化并结构res，状态码201成功
                // ,this.addForm ,添加的对象
               const {data:res} =await this.$http.post('users',this.addForm)
               if (res.meta.status !== 201){
                    return this.$message.error('添加用户失败！')
               }
               this.$message.success('添加用户成功')
            //    隐藏添加用户对话框
               this.addDialogVisible=false
            //    刷新用户列表
            this.getUserList()
            })
            
        },
            // 展示编辑用户对话框
            async showEditDialog(id){
                // console.log(id)
                // users/:id改为动态
                const {data:res} =await this.$http.get('users/'+id)
                if (res.meta.status !== 200){
                    return this.$message.error('查询用户信息失败')
                }
                // editForm信息绑定给表单
                this.editForm =res.data
                // console.log(res.data)

                this.editDialogVisible =true


            },
            
             // 监听添加用户对话框的关闭事件
            editDialogClosed(){
                // 通过表单的ref引用 调用resetFields（）函数重置表单
            this.$refs.editFormRef.resetFields()

            },

            // 修改用户信息并提交
            editUserInfo(){

                this.$refs.editFormRef.validate( async valid =>{
                
                // console.log(valid)
                // 如果返回值不是true，就返回
                if(!valid) return

                // 可以发起添加用户网络请求,promise简化并结构res，状态码201成功
                // ,this.editForm ,添加的对象
               const {data:res} =await this.$http.put('users/'+this.editForm.id,
               {email:this.editForm.email,mobile:this.editForm.mobile})
               if (res.meta.status !== 200){
                    return this.$message.error('修改用户信息失败！')
               }
               this.$message.success('修改用户信息成功')
            //    隐藏添加用户对话框
               this.editDialogVisible=false
            //    刷新用户列表
            this.getUserList()
            })


            },

            // 弹框询问用户是否删除数据
            async removeUserById(id){
                // console.log(id)
                // $confirm返回promise，await简化，返回字符串confirm和cancel
                 const confirmResult =await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示',
                  {
                 confirmButtonText: '确定',
                 cancelButtonText: '取消',
                type: 'warning'
                 }).catch(err=>err)
                // catch是为了把取消报错组成返回值err

                // console.log(confirmResult)
                if(confirmResult!='confirm'){
                    return this.$message.info('已取消删除')
                }
                // this.$message.success('确认删除')


                // axios delete请求删除id
                const {data:res}= await this.$http.delete('users/'+id)
                
                if(res.meta.status!==200){
                    return this.$message.error('删除失败')
                }
                this.$message.success('确认删除')
                // 刷新用户列表
                this.getUserList()
            },
    // 展示分配角色的对话框
    async setRole(userInfo) {
      this.userInfo = userInfo

      // 在展示对话框之前，获取所有角色的列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }

      this.rolesList = res.data

      this.setRoleDialogVisible = true
    },
        // 点击按钮，分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色！')
      }

      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId
        //   角色类别id
        }
      )

      if (res.meta.status !== 200) {
        //   admin不可以分配
        //   console.log(res.meta.status)
        return this.$message.error('更新角色失败！')
      }

      this.$message.success('更新角色成功！')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = {}
    }


    }
}
</script>
 
 <style lang="less" scoped>
 
 </style>
 
