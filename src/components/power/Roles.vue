<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
            <!-- 定义展开 -->
          <template slot-scope="scope">
              <!-- 三层for循环  -->
           <!-- v-for="(item1, i1) in scope.row.children"把一级权限渲染进去循环，把底部el-tag class绑定每一行 -->
           <!-- 判断是不是第一行，是的话引用'bdtop，不是可以忽略,i1接收行数 -->

            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
                 <!-- 栅格第一列一级权限5列，col最多24列-->
              <el-col :span="5">
                  <!-- {item1.authName｝一级权限名 -->
                  <!-- 为close添加打开弹窗事件 -->

                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <!-- 小箭头 -->
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限，二左三右 -->
              <el-col :span="19">
                <!-- 通过 for 循环 嵌套渲染二级权限，二级边框第一个不用bdtop，以为有了最开始一行的，只要其下面有就好 -->
                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                <!-- 小箭头 -->                    
                    <i class="el-icon-caret-right"></i>
                  </el-col>


                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3, i3) in item2.children" :key="item3.id" 
                    closable @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              
              </el-col>
            </el-row>

            <!-- scope数据 -->
            <!-- <pre>
              {{scope.row}}
            </pre> -->

          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <!-- prop指定绑定的标题文本，show-checkbox选择小盒子，node-key="id"勾选盒子id唯一值
      default-expand-all，默认展开所有节点，:default-checked-keys="defKeys"，默认勾选的节点-->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" 
      default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件的属性绑定对象,子节点
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点Id值数组
      defKeys: [],
      // 当前即将分配权限的角色id,弹窗时传入使用
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')

      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }

      this.rolelist = res.data

      console.log(this.rolelist)
    },


    // 根据Id删除对应的权限
    async removeRightById(role, rightId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }
        // role.id 角色id，rightId 权限childre.id
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )

      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败！')
      }
        // 全部渲染太浪费，返回的data, 是当前角色下最新的权限数据
        // role.children = res.data的意义是防止刷新浪费并且可以避免刷新带来重新渲染折叠
      // this.getRolesList()

      role.children = res.data
    //   对当前角色的权限重新赋返回的权限
    },


    // 展示分配权限的对话框
    // 接受当前角色，方便当做节点递归
    async showSetRightDialog(role) {
        // 为弹出的对话传入当前打开的role.id
      this.roleId = role.id
      // 获取所有权限的数据，tree方式
      const { data: res } = await this.$http.get('rights/tree')

      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败！')
      }

      // 把获取到的权限数据保存到 data 中
      this.rightslist = res.data
      console.log(this.rightslist)

      // 递归获取三级节点的Id，只有三级才是最后被选中的
      this.getLeafKeys(role, this.defKeys)

      this.setRightDialogVisible = true
    },


    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => this.getLeafKeys(item, arr))
    },


    // 监听分配权限对话框的关闭事件，防止每次点击时存了别的角色存的数据，要清空
    setRightDialogClosed() {
      this.defKeys = []
    },


    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        //   获取选中节点数组
        // ...展开运算符,将一个数组转为用逗号分隔的参数序列
        ...this.$refs.treeRef.getCheckedKeys(),
        // 获取半选中节点数组
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
    
    // 形成以逗号拼接的字符串
      const idStr = keys.join(',')


      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
// rids: idStr，传递字符串给rids
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }

      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
    // 第一个的头部边框线
  border-top: 1px solid #eee;
}

.bdbottom {
    // 所有底部边框分隔
  border-bottom: 1px solid #eee;
}

.vcenter {
    // 纵向居中对齐，居中需flex
  display: flex;
  align-items: center;
}
</style>
