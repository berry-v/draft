<template>
  <div class="workflow">
    <helpinfo :helpData="helpData" />
    <div class="con">
      <div class="canvas"
           ref="workflow"
           id="workflow"></div>
      <operation :nodeData='currentNode'
                 @save="nodeSave"
                 @cancel="removeCurrentNode"></operation>
    </div>
  </div>
</template>

<script>

import helpinfo from '../components/helpinfo'
import operation from './components/operation'
import G6 from '@antv/g6'
import '@antv/g6/build/plugin.layout.dagre'
import '@antv/g6/build/plugin.behaviour.analysis'
import '@antv/g6/build/plugin.tool.grid'
import '@antv/g6/build/plugin.edge.polyline'
export default {
  name: 'workflow',
  components: {
    helpinfo,
    operation
  },
  data () {
    return {
      helpData: {
        modelName: '工作流',
        type: 'system'
      },
      currentNode: null,
      temporaryNode: null,
      lineStyle: {
        'success': '#5cb85c',
        'error': '#d9534f',
        'start': '#337ab7',
        'new': '#d7d7d7'
      },
      data: {
        nodes: [{
          id: '0',
          name: 'start'
        }, {
          id: '1',
          name: 'Demo Job Template'
        }, {
          id: '2',
          name: 'Test Lynis'
        }, {
          id: '3',
          name: 'BANABANA'
        }, {
          id: '4',
          name: 'Demo Data'
        }, {
          id: '5',
          name: 'end'
        }],
        edges: [{
          source: '0',
          target: '1',
          status: 'success'
        }, {
          source: '0',
          target: '2',
          status: 'error'
        }, {
          source: '0',
          target: '3',
          status: 'success'
        }, {
          source: '0',
          target: '4',
          status: 'error'
        }, {
          source: '3',
          target: '5',
          status: 'success'
        }]
      },
      graph: null
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      let pack = this.$refs.workflow
      const PluginDagre = G6.Plugins['layout.dagre'] // eslint检查出错， 所以提出来
      const PluginGrid = G6.Plugins['tool.grid']
      this.graph = new G6.Graph({
        container: 'workflow',
        renderer: 'svg',
        fitView: 'cc',
        width: pack.offsetWidth,
        height: pack.offsetHeight,
        defaultIntersectBox: 'rect',
        modes: {
          default: ['panCanvas', 'wheelZoom']
        },
        plugins: [
          new PluginDagre({
            rankdir: 'LR',
            nodesep: 20,
            ranksep: 70
          }),
          new PluginGrid({
            type: 'line',
            line: {
              cell: 10,
              stroke: '#e9e9e9',
              lineWidth: 0.25
            }
          })
        ]
      })
      this.nodeInit()
      this.lineInit()
      this.graph.read(this.data)
      this.graph.on('click', this.eventClick)
      this.graph.on('node:mouseenter', this.eventMouseenter)
      this.graph.on('node:mouseleave', this.eventMouseleave)
    },
    nodeInit () {
      G6.registerNode('customNode', {
        intersectBox: 'circle',
        anchor: [
          [0, 0.5], // 右边中点
          [1, 0.5] // 右边中点
        ],
        draw (item) {
          const group = item.getGraphicGroup()
          const model = item.getModel()
          let wP = 200 // width package
          let hP = 80
          let w = wP - 5 // width
          let h = hP - 5
          group.addShape('rect', {
            attrs: {
              x: -wP / 2,
              y: -hP / 2,
              radius: 2,
              width: wP,
              height: hP
            }
          })
          group.addShape('rect', {
            attrs: {
              x: -w / 2,
              y: -h / 2,
              width: w,
              height: h,
              stroke: '#d7d7d7',
              lineWidth: 3,
              strokeOpacity: 1,
              lineDash: !model.temporary ? 0 : [8, 4],
              radius: 2,
              fill: model.bg || '#fcfcfc'
            }
          })
          if (model.active) {
            group.addShape('rect', {
              attrs: {
                x: -w / 2 + 1,
                y: -h / 2 + 1,
                width: 3,
                height: h - 2,
                fill: '#337ab7',
                radius: [2, 0, 0, 2]
              }
            })
          }
          group.addShape('text', {
            attrs: {
              x: 0,
              y: 0,
              width: w,
              height: h,
              fill: '#333',
              text: model.name,
              textBaseline: 'middle',
              textAlign: 'center'
            }
          })
          if (model.enter) {
            group.addShape('dom', {
              attrs: Object.assign({
                x: wP / 2 - 13,
                y: -hP / 2 - 6,
                html: G6.Util.createDOM('<i id="addNode" class="icon-groups-btn-add graph-icon"></i>')
              })
            })
            group.addShape('dom', {
              attrs: Object.assign({
                x: wP / 2 - 13,
                y: hP / 2 - 13,
                html: G6.Util.createDOM('<i id="deleteNode" class="icon-groups-btn-del graph-icon"></i>')
              })
            })
          }
          return group
        }
      })

      this.graph.node({
        shape: 'customNode',
        label: function label (model) {
          return model.id
        }
      })
    },
    lineInit () {
      G6.registerEdge('customLine', {
        getPath (item) {
          var points = item.getPoints()
          var start = points[0]
          var end = points[points.length - 1]
          return [
            ['M', start.x, start.y],
            ['C', start.x, start.y, end.x, end.y, end.x, end.y]
          ]
        }
      })
      let _self = this
      this.graph.edge({
        shape: 'customLine',
        style ({ status }) {
          return {
            stroke: _self.lineStyle[status] || '#d7d7d7',
            lineWidth: 3
          }
        }
      })
    },
    eventClick (ev) {
      let item = ev.item
      if (!item) {
        return
      }
      if (item.type === 'node') {
        if (!this.temporaryNode || this.temporaryNode.id !== item.id) { // 点击非临时node
          this.temporaryNode && this.graph.remove(this.temporaryNode.id)// 移除临时node
          this.graph.update(this.currentNode, { active: false }) // 取消其他节点的选中
          this.graph.update(item, { active: true }) // 当前节点选中
          this.currentNode = item
        }
        let id = ev.domEvent.target.id
        if (id === 'addNode') {
          this.addNode(item)
        } else if (id === 'deleteNode') {
          this.deleteNode(item)
        }
      } else if (item.type === 'edge') {
        console.log('------------------点击连线------------------')
      }
    },
    eventMouseenter ({ item }) {
      !item.model.temporary && this.graph.update(item, {
        enter: true
      })
    },
    eventMouseleave ({ item }) {
      !item.model.temporary && this.graph.update(item, {
        enter: false
      })
    },
    addNode (item) {
      let node = {
        id: new Date().getTime(),
        name: ''
      }
      this.graph.add('node', {
        id: node.id,
        name: '',
        temporary: true
      })
      this.graph.add('edge', {
        source: item.id,
        target: node.id,
        status: 'new'
      })
      this.graph.update(this.currentNode, { active: false })
      this.currentNode = this.graph.find(node.id)
      this.temporaryNode = node
    },
    deleteNode (item) {
      this.$Modal.info({
        title: '确定要删除此工作流节点?',
        onOk: () => {
          let parentId
          let childs = item.getEdges().filter(edge => {
            if (edge.model.target === item.model.id) {
              parentId = edge.model.source
              return false
            }
            return true
          })
          this.graph.remove(item.id)
          childs.forEach(edge => {
            edge.target.getEdges().length === 0 && this.graph.add('edge', {
              source: parentId,
              target: edge.model.target,
              status: edge.model.status
            })
          })
        }
      })
    },
    nodeSave (param) {
      this.graph.update(param.nodeid, {
        name: param.template,
        temporary: false // 有临时node的情况
      })
      this.temporaryNode = null // 置空临时node
      this.graph.update(param.edgeid, {
        status: param.status
      })
    },
    removeCurrentNode () { // cancel 后的操作
      this.graph.update(this.currentNode, { active: false })
      this.currentNode = null
    }
  }
}
</script>
<style lang="less">
@import url('./antvG6.less');
</style>
