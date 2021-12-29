<template>
    <el-card shadow="always">
        <FormDesign ref="formDesignRef"/>
    </el-card>
</template>

<script setup>
    import { ref, onMounted } from 'vue'

    const formDesignRef = ref(null)
    onMounted(() => {
        formDesignRef.value.register('自定义唯一组件', [
            {
                name: '输入框',
                component: 'input',
                uuid: 'unique',
                options: {
                    label: '输入框',
                    key: '',
                    defaultValue: ''
                }
            }
        ])
    })

</script>

<style lang="scss">
$colors: (
        "primary": (
                "base": #1C9FA0,
        ),
        'warning': (
                'base': #FFAE22,
        ),
);
.el-form {
    .el-form-item:last-of-type {
        margin-bottom: 25px !important;
    }
};
</style>