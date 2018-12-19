<template>
  <div class="operation">
    <div v-if="form.nodeid">
      <div class="tit">{{form.name || '添加模板'}}</div>
      <div class="pack">
        <RadioGroup v-model="form.template"
                    vertical>
          <Radio v-for="tmp in templateData"
                 :key="tmp.id"
                 :label="tmp.value"></Radio>
        </RadioGroup>
        <Select v-model="form.status">
          <Option v-for="(v, k) in status"
                  :value="k"
                  :key="k">{{v}}</Option>
        </Select>
        <div v-show="form.template">
          <Button @click="cancel">取消</Button>
          <Button type="primary"
                  @click="save">保存</Button>
        </div>
      </div>
    </div>
    <div v-else>请选择模板</div>
  </div>
</template>

<script>
export default {
  name: 'operation',
  props: ['nodeData'],
  data () {
    return {
      form: {},
      templateData: [{
        id: '1',
        value: 'Demo Job Template'
      }, {
        id: '2',
        value: 'lynis'
      }, {
        id: '3',
        value: 'w_template'
      }, {
        id: '4',
        value: 'Test Lynis'
      }, {
        id: '5',
        value: 'BANABANA'
      }, {
        id: '6',
        value: 'Demo Data'
      }],
      status: {
        success: '成功',
        error: '失败'
      }
    }
  },
  watch: {
    nodeData (val) {
      if (val) {
        let edges = val.getEdges().filter(e => {
          return e.model.target === val.model.id
        })
        this.form = {
          nodeid: val.id,
          name: val.model.name,
          template: val.model.name,
          edgeid: edges[0] && edges[0].id,
          status: edges[0] && edges[0].model.status
        }
      } else {
        this.form = {}
      }
    }
  },
  mounted () {
  },
  methods: {
    save () {
      this.$emit('save', this.form)
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>
