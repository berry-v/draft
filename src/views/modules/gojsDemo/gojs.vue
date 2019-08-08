<template>
  <div class="workflow">
    <div class="tool"
         id="tool">
    </div>
    <div ref="workflowCon"
         class="con"
         id="workflow">
    </div>

    <!-- <textarea id="mySavedModel"
              style="width:100%;height:300px">
      { "class": "go.GraphLinksModel", "linkFromPortIdProperty": "fromPort", "linkToPortIdProperty": "toPort", "nodeDataArray": [ ], "linkDataArray": [ ]}
    </textarea> -->
  </div>
</template>

<script>
import helpinfo from '../components/helpinfo'
import gojs from './gojs'
export default {
  name: 'workflow',
  components: {
    helpinfo
  },
  data () {
    return {
      helpData: {
        modelName: '工作流',
        type: 'system'
      },
      diagram: null
    }
  },
  mounted () {
    console.log(gojs, '@@@@@')
    gojs.init()
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
@import url('./gojs.less');
</style>
