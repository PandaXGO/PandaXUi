<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="card-header-text">
             <el-input v-model="state.queryParams.name" placeholder="名称搜索" clearable>
                <template #append>
                  <el-button :icon="Search" @click="handleQuery"></el-button>
                </template>
              </el-input>
          </span>
          <div>
            <el-button
                type="primary"
                plain
                @click="onOpenModule({})"
            ><SvgIcon name="elementPlus" />新增</el-button>
          </div>
        </div>
      </template>
      <el-table
          v-loading="state.loading"
          border
          :data="state.tableData"
      >
        <el-table-column label="命令名称" align="center" prop="name"/>
        <el-table-column label="命令标识" align="center" prop="key"/>
        <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-popover  placement="left">
              <template #reference>
                <el-button type="primary" circle ><SvgIcon name="elementStar"/></el-button>
              </template>
              <div>
                <el-button text type="primary" @click="onOpenModule(scope.row)">
                  <SvgIcon name="elementEdit"/>
                  修改
                </el-button>
              </div>
              <div>
                <el-button text type="primary" @click="onTabelRowDel(scope.row)">
                  <SvgIcon name="elementDelete"/>
                  删除
                </el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="state.total > 0">
        <el-divider></el-divider>
        <el-pagination
            background
            :total="state.total"
            :current-page="state.queryParams.pageNum"
            :page-size="state.queryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <el-dialog v-model="state.isShowCommandDialog" width="769px" center draggable>
      <el-form
          :model="state.ruleForm"
          :rules="state.ruleRules"
          ref="ruleFormRef"
          label-width="80px"
      >
        <el-form-item label="命令名称" prop="name">
          <el-input
              v-model="state.ruleForm.name"
              placeholder="请输入命令名称"
          />
        </el-form-item>
        <el-form-item label="命令标识" prop="key">
          <el-input
              v-model="state.ruleForm.key"
              placeholder="请输入命令标识, 第一个字符不能是数字，支持英文、数字、下划线的组合"
          />
        </el-form-item>
        <el-form-item label="输入参数">
          <div class="param" v-for="(input,index) in state.define.input" :key="index">
              <div>参数名称： {{ input.name }}</div>
              <div>
                <el-button type="primary" size="small" @click="elementDefineEdit('input',index)">
                  <SvgIcon name="elementEdit"/>
                </el-button>
                <el-button type="primary" size="small" @click="elementDefineDelete('input',index)">
                  <SvgIcon name="elementDelete"/>
                </el-button>
              </div>
          </div>
          <el-button type="primary" @click="elementDefinePlus('input')">
            <SvgIcon name="elementPlus"/>
          </el-button>
        </el-form-item>
        <el-form-item label="输出参数">
          <div class="param" v-for="(output,index) in state.define.output" :key="index">
            <div>参数名称： {{ output.name }}</div>
            <div>
              <el-button type="primary" size="small" @click="elementDefineEdit('output',index)">
                <SvgIcon name="elementEdit"/>
              </el-button>
              <el-button type="primary" size="small" @click="elementDefineDelete('output',index)">
                <SvgIcon name="elementDelete"/>
              </el-button>
            </div>
          </div>
          <el-button type="primary" @click="elementDefinePlus('output')">
            <SvgIcon name="elementPlus"/>
          </el-button>
        </el-form-item>
        <el-form-item label="命令说明" prop="description">
          <el-input v-model="state.ruleForm.description" :rows="4" type="textarea" placeholder="请输入命令说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="onSubmit" :loading="state.loading">确 认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="state.isShowDialog" width="700px" center draggable>
      <el-form
          :model="state.ruleFormParam"
          :rules="state.ruleRules"
          ref="ruleFormParamRef"
          label-width="80px"
      >
        <el-form-item label="参数名称" prop="name">
          <el-input
              v-model="state.ruleFormParam.name"
              placeholder="请输入参数名称"
          />
        </el-form-item>
        <el-form-item label="参数标识" prop="key">
          <el-input
              v-model="state.ruleFormParam.key"
              placeholder="请输入参数标识, 第一个字符不能是数字，支持英文、数字、下划线的组合"
          />
        </el-form-item>
        <el-form-item label="数据类型" prop="type">
          <el-radio-group v-model="state.ruleFormParam.type" fill="var(--color-primary)" @change="handeType">
            <el-radio-button label="int64" >整数型</el-radio-button>
            <el-radio-button label="float64">浮点型</el-radio-button>
            <el-radio-button label="bool" >布尔型</el-radio-button>
            <el-radio-button label="string" >字符串</el-radio-button>
            <el-radio-button label="enum" >枚举</el-radio-button>
            <el-radio-button label="date" >时间</el-radio-button>
            <el-radio-button label="struct">结构体</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <template v-if="state.ruleFormParam.type === 'int64' || state.ruleFormParam.type === 'float64'">
          <el-form-item label="取值范围">
            <el-row :gutter="25">
              <el-col :span="11"><el-input-number v-model="state.ruleFormParam.define.min" placeholder="最小值"/></el-col>
              <el-col :span="2">~</el-col>
              <el-col :span="11"><el-input-number v-model="state.ruleFormParam.define.max" placeholder="最大值"/></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="步长">
            <el-input-number v-model="state.ruleFormParam.define.step" placeholder="步长"/>
          </el-form-item>
          <el-form-item label="单位">
            <el-input v-model="state.ruleFormParam.define.unit" placeholder="请输入单位，例如：℃"/>
          </el-form-item>
        </template>
        <template v-if="state.ruleFormParam.type === 'string'">
          <el-form-item label="数据长度">
            <el-input v-model="state.ruleFormParam.define.maxLength" type="number" placeholder="数据长度">
              <template #prepend>字节</template>
            </el-input>
          </el-form-item>
        </template>
        <template v-if="state.ruleFormParam.type === 'bool'">
          <el-form-item label="数据约束">
            <el-row :gutter="25">
              <el-col v-for="(v,k) in state.ruleFormParam.define.boolDefine" :key="k" :span="12">
                <el-input v-model="v.value" placeholder="含义">
                  <template #prepend>{{ v.key }}</template>
                </el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </template>
        <template v-if="state.ruleFormParam.type === 'date'">
          <el-form-item label="日期格式">
            <el-input v-model="state.ruleFormParam.define.format" placeholder="日期格式"></el-input>
          </el-form-item>
        </template>
        <template v-if="state.ruleFormParam.type === 'enum'">
          <el-form-item label="枚举值">
            <el-row :gutter="25" v-for="(v,index) in state.ruleFormParam.define.enumDefine" :key="index">
              <el-col :span="10"><el-input v-model="v.key" placeholder="枚举键"/></el-col>
              <el-col :span="2">-</el-col>
              <el-col :span="10"><el-input v-model="v.value" placeholder="枚举值"/></el-col>
              <el-col :span="2"><el-button type="primary" @click="setEnumValue(index)">
                <SvgIcon :name="index === 0 ? 'elementPlus':'elementDelete'"/>
              </el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </template>
        <el-form-item label="遥测说明" prop="description">
          <el-input v-model="state.ruleFormParam.description" :rows="4" type="textarea" placeholder="请输入遥测说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.isShowDialog = false">取 消</el-button>
          <el-button type="primary" @click="onSubmitParam">确 认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref, unref} from "vue";
import {addTemplate, delTemplate, listTemplate, updateTemplate} from "@/api/device/product_template";
import {ElMessage, ElMessageBox} from "element-plus";
import { Search } from '@element-plus/icons-vue'

const props:any = defineProps({
  rowData: {
    type: Object,
    default: () => {},
  },
})
const ruleFormRef = ref<HTMLElement | null>(null);
const ruleFormParamRef = ref<HTMLElement | null>(null);
const state = reactive<any>({
  // 遮罩层
  loading: false,
  // 岗位表格数据
  tableData: [],
  // 总条数
  total: 0,
  queryParams: {
    // 页码
    pageNum: 1,
    // 每页大小
    pageSize: 10,
    pid: "",  //产品Id
    name: "",
    classify: "commands",
  },
  isShowCommandDialog: false,
  isShowDialog: false,
  currentDefine: {
    opr: "",
    type: "",
    index: 0
  },
  ruleForm: {
    id: "",
    pid: "",
    name: "",
    key: "",
    type: "struct",
    description: "",
  },
  ruleFormParam: {
    id: "",
    pid: "",
    name: "",
    key: "",
    type: "string",
    description: "",
  },
  define: {},
  ruleRules: {
    name: [
      { required: true, message: "名称不能为空", trigger: "blur" }
    ],
    key: [
      { required: true, message: "标识不能为空", trigger: "blur" },
      { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '标识格式不正确,支持英文、数字、下划线的组合,首位字符不能是数字', trigger: 'blur' }
    ],
    type: [
      { required: true, message: "类型不能为空", trigger: "blur" }
    ],
  },
});

// 查询列表
const handleQuery = () => {
  state.loading = true;
  state.queryParams.pid = props.rowData.id
  listTemplate(state.queryParams).then((response:any) => {
    if (response.code === 200) {
      state.tableData = response.data.data;
      state.total = response.data.total;
    }
    state.loading = false;
  });
};

const handleCurrentChange = (val: number) => {
  state.queryParams.pageNum = val
  handleQuery()
}
const handleSizeChange = (val: number) => {
  state.queryParams.pageSize = val
  handleQuery()
}

const onOpenModule = (row: any) => {
  state.isShowCommandDialog = true
  state.ruleForm = row
  state.ruleForm.classify = "commands"
  if (row.define){
    state.define = row.define
  }else {
    state.define = {
      input: [],
      output: []
    }
  }
}
// 取消
const onCancel = () => {
  state.isShowCommandDialog = false
  //handleQuery()
};
const onTabelRowDel = (row: any) => {
  const ids = row.id
  ElMessageBox({
    message: '是否确认删除编号为"' + ids + '"的数据项?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    return delTemplate(ids).then((res:any) => {
      if (res.code === 200){
        handleQuery();
        ElMessage.success("删除成功");
      }else {
        ElMessage.error("删除失败");
      }
    });
  });
};
// 保存
const onSubmit = () => {
  const formWrap = unref(ruleFormRef) as any;
  if (!formWrap) return;
  formWrap.validate((valid: boolean) => {
    if (valid) {
      state.loading = true;
      state.ruleForm.pid = props.rowData.id
      state.ruleForm.define = state.define
      if (state.ruleForm.id != undefined && state.ruleForm.id != "") {
        updateTemplate(state.ruleForm).then((res:any) => {
          if (res.code===200){
            ElMessage.success("修改成功");
            onCancel(); // 关闭弹窗
          }
          state.loading = false;
        });
      } else {
        addTemplate(state.ruleForm).then((res:any) => {
          if (res.code===200){
            ElMessage.success("新增成功");
            onCancel(); // 关闭弹窗
          }
          state.loading = false;
        });
      }
    }
  });
};

const onSubmitParam = () => {
  state.ruleFormParam.define = getDefine()
  if (state.currentDefine.opr === "add"){
    if (state.currentDefine.type === "input"){
      state.define.input.push(state.ruleFormParam)
    }else {
      state.define.output.push(state.ruleFormParam)
    }
  }else {
    if (state.currentDefine.type === "input"){
      state.define.input[state.currentDefine.index](state.ruleFormParam)
    }else {
      state.define.output[state.currentDefine.index](state.ruleFormParam)
    }
  }
  state.isShowDialog = false
}
// 类型切换
const handeType = () => {
  const type = state.ruleFormParam.type
  if (type === "bool") {
    if (!state.ruleFormParam.define.boolDefine){
      state.ruleFormParam.define.boolDefine = [{
        "key": "0",
        "value": ""
      },{
        "key": "1",
        "value": ""
      }]
    }
  }
  if (type === 'enum') {
    if (!state.ruleFormParam.define.enumDefine){
      state.ruleFormParam.define.enumDefine = [{
        "key": "0",
        "value": "开"
      }]
    }
  }
  if (type === "date") {
    state.ruleFormParam.define.format = state.ruleFormParam.define.format || "YYYY-MM-DD"
  }
  if (type === "struct") {
    if (!state.ruleFormParam.define.structDefine){
      state.ruleFormParam.define.structDefine = {}
    }
  }
}

const setEnumValue = (index: number) => {
  if (index === 0){
    state.ruleFormParam.define.enumDefine.push({
      "key": "",
      "value": ""
    })
  }else {
    state.ruleFormParam.define.enumDefine.splice(index, 1);
  }
}
// 获取类型相同的拓展
const getDefine = () => {
  const type = state.ruleFormParam.type
  switch (type) {
    case "int64":
    case "float64":
      return {
        "min": state.ruleFormParam.define.min,
        "max": state.ruleFormParam.define.max,
        "step": state.ruleFormParam.define.step,
        "unit": state.ruleFormParam.define.unit,
      }
    case "bool":
      return {
        boolDefine: state.ruleFormParam.define.boolDefine,
      }
    case "string":
      return {
        maxLength: state.ruleFormParam.define.maxLength,
      }
    case "enum":
      return {
        enumDefine: state.ruleFormParam.define.enumDefine,
      }
    case "date":
      return {
        format: state.ruleFormParam.define.format,
      }
    case "struct":
      return {
        structDefine: state.ruleFormParam.define.structDefine,
      }
  }
}

const elementDefinePlus = (type: string) => {
  state.isShowDialog = true
  state.currentDefine.type = type
  state.currentDefine.opr = "add"
  state.ruleFormParam = {
    define: {}
  }
}

const elementDefineEdit = (type: string,index:number) => {
  state.isShowDialog = true
  state.currentDefine.type = type
  state.currentDefine.index = index
  state.currentDefine.opr = "add"
  if (type === 'input'){
    state.ruleFormParam = state.define.input[index]
  }else {
    state.ruleFormParam = state.define.output[index]
  }
}
const elementDefineDelete = (type: string,index:number) => {
  if (type === 'input'){
    state.define.input.splice(index, 1);
  }else {
    state.define.output.splice(index, 1);
  }
}

onMounted(()=>{
  handleQuery()
})
</script>

<style scoped>
.param{
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  align-items: center;
  background-color: var(--color-primary-light-9);
  padding: 0.5rem;
}
</style>
