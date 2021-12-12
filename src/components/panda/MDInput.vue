<template>
  <el-input
    :placeholder="placeholder"
    v-model="inputVal"
    @update:modelValue="backValue"
  ></el-input>
</template>
<script lang="ts">
import { getCurrentInstance, toRefs, ref, reactive, watch } from "vue";
// import inputManage from './inputManage'
const JINPUT_QUERY_LIKE = "like"; // 模糊查询
const JINPUT_QUERY_NE = "ne"; // 等于
const JINPUT_QUERY_GE = "ge"; //大于等于
const JINPUT_QUERY_LE = "le"; //小于等于
export default {
  name: "MDInput",
  props: {
    modelValue: String,
    placeholder: String,
    type: {
      type: String,
      required: false,
      default: JINPUT_QUERY_LIKE,
    },
  },
  emits: ["update:modelValue"],
  setup(props, context) {
    const { proxy } = getCurrentInstance() as any;
    const state = reactive({
      inputVal: "",
    });
    // https://www.jianshu.com/p/a3c3ba59f812 參考的文档
    // const { value, myInput } = inputManage(props, context)
    // 监听双向绑定 modelValue 的变化
    // watch(
    //   () => [props.value],
    //   () => {
    //     initVal();
    //   }
    // );

    const backValue = (e: any) => {
      let text = e;
      switch (props.type) {
        case JINPUT_QUERY_LIKE:
          text = "*" + text + "*";
          break;
        case JINPUT_QUERY_NE:
          text = "!" + text;
          break;
        case JINPUT_QUERY_GE:
          text = ">=" + text;
          break;
        case JINPUT_QUERY_LE:
          text = "<=" + text;
          break;
        default:
      }
      proxy.$emit("update:modelValue", text);
    };

    const initVal = () => {
      console.log("initVal", !props.modelValue);
      if (!props.modelValue) {
        state.inputVal = "";
      } else {
        let text = props.modelValue;
        switch (props.type) {
          case JINPUT_QUERY_LIKE:
            //修复路由传参的值传送到jinput框被前后各截取了一位
            if (text.indexOf("*") != -1) {
              text = text.substring(1, text.length - 1);
            }
            break;
          case JINPUT_QUERY_NE:
            text = text.substring(1);
            break;
          case JINPUT_QUERY_GE:
            text = text.substring(2);
            break;
          case JINPUT_QUERY_LE:
            text = text.substring(2);
            break;
          default:
        }
        state.inputVal = text;
      }
    };
    return {
      initVal,
      backValue,
      ...toRefs(state),
    };
  },
};
</script>