<template>
    <div id="app">
        <form-create v-model:api="state.fApi" :rule="state.rule" :option="state.option" :v-model="state.value" @submit="onSubmit"></form-create>
    </div>
</template>

<script setup lang="ts">
    import {reactive} from 'vue'
    const state = reactive({
        // 遮罩层
        fApi: null,
        value: {},
        // 弹出层标题
        rule: [
            {
                "type": "input",
                "field": "5pl1m5vquwi8f",
                "title": "输入框",
                "info": "",
                "_fc_drag_tag": "input",
                "hidden": false,
                "display": true
            },
            {
                "type": "inputNumber",
                "field": "egq1m5vqv309i",
                "title": "计数器",
                "info": "",
                "_fc_drag_tag": "inputNumber",
                "hidden": false,
                "display": true
            },
            {
                "type": "radio",
                "field": "3cj1m5vqv5zo9",
                "title": "单选框",
                "info": "",
                "effect": {
                    "fetch": ""
                },
                "options": [
                    {
                        "value": "1",
                        "label": "选项1"
                    },
                    {
                        "value": "2",
                        "label": "选项2"
                    }
                ],
                "_fc_drag_tag": "radio",
                "hidden": false,
                "display": true
            }
        ],
        //组件参数配置
        option: {
            "inline": false,
            "labelPosition": "right",
            "size": "mini",
            "labelWidth": "125px",
            "hideRequiredAsterisk": false,
            "showMessage": true,
            "inlineMessage": false,
        }
    });
    const onSubmit = (formData:any)=> {
        console.log(formData)
    }

</script>

<style lang="scss">

</style>