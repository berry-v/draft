<template>
  <div class="workflow">
    <helpinfo :helpData="helpData" />
    <div ref="workflowCon"
         class="con"
         id="workflow">
    </div>
  </div>
</template>

<script>
import helpinfo from '../components/helpinfo'
import go from 'gojs'
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
    this.init()
  },
  methods: {
    init () {
      let $ = go.GraphObject.make
      let diagram = $(go.Diagram, 'workflow', {
        grid: $(go.Panel, 'Grid',
          $(go.Shape, 'LineH', {
            stroke: 'lightgray',
            strokeWidth: 0.5
          }), // 浅灰色线
          $(go.Shape, 'LineH', {
            stroke: 'gray',
            strokeWidth: 0.5,
            interval: 10
          }), // 十格后一根灰色线
          $(go.Shape, 'LineV', {
            stroke: 'lightgray',
            strokeWidth: 0.5
          }),
          $(go.Shape, 'LineV', {
            stroke: 'gray',
            strokeWidth: 0.5,
            interval: 10
          })
        ), // 网格样式
        'grid.visible': true, // 画布上面是否出现网格
        'grid.gridCellSize': new go.Size(15, 15), // 每个小格子的尺寸
        allowDrop: true, // 获取或设置用户是否可以结束此图中的拖放操作
        // allowZoom: false, //不允许用户更改图表的刻度
        initialContentAlignment: go.Spot.Center, // 初始内容对齐：居中
        'undoManager.isEnabled': true, // 允许用户操作图表的时候使用Ctrl-Z撤销和Ctrl-Y重做快捷键
        'clickCreatingTool.archetypeNodeData': { text: 'Node' }, // 允许双击背景创建一个新的节点
        'commandHandler.copiesTree': true, // 允许使用ctrl+c、ctrl+v复制粘贴
        'commandHandler.deletesTree': true, // 允许使用delete键删除节点
        'toolManager.mouseWheelBehavior': go.ToolManager.WheelZoom, // 有鼠标滚轮事件放大和缩小，而不是向上和向下滚动
        'draggingTool.dragsTree': true, // 获取或设置是否移动或复制节点还包括节点的所有树子节点及其子节点，以及指向这些附加节点的链接。
        'draggingTool.dragsLink': true, // 获取或设置用户是否可以拖动单个链接，将其从其连接的节点断开，并在链接被删除时可能将其连接到有效端口。
        'draggingTool.isGridSnapEnabled': true, // 获取或设置拖动工具是否将对象捕捉到网格点。被拖动部分的抓取运动是在拖动期间发生的，还是只在拖放时发生，由isGridSnapRealtime的值决定。
        'linkingTool.isUnconnectedLinkValid': false,
        'linkingTool.portGravity': 20,
        'relinkingTool.isUnconnectedLinkValid': true,
        'relinkingTool.portGravity': 20,
        'relinkingTool.fromHandleArchetype': $(go.Shape, 'Diamond', { // 起始连接点
          segmentIndex: 0,
          cursor: 'pointer',
          desiredSize: new go.Size(8, 8),
          fill: 'tomato',
          stroke: 'darkred'
        }),
        'relinkingTool.toHandleArchetype': $(go.Shape, 'Diamond', { // 结束连接点
          segmentIndex: -1,
          cursor: 'pointer',
          desiredSize: new go.Size(8, 8),
          fill: 'darkred',
          stroke: 'tomato'
        }),
        'linkReshapingTool.handleArchetype': $(go.Shape, 'Diamond', { // 中间连接点
          desiredSize: new go.Size(17, 17),
          fill: 'lightblue',
          stroke: 'yellow'
        }),
        layout: $(go.TreeLayout)
      })

      let makePort = (name, spot, output, input) => {
        // the port is basically just a small transparent square
        return $(go.Shape, 'Rectangle', {
          fill: null, // not seen, by default; set to a translucent gray by showSmallPorts, defined below
          stroke: null,
          desiredSize: new go.Size(7, 7),
          alignment: spot, // align the port on the main Shape
          alignmentFocus: spot, // just inside the Shape
          portId: name, // declare this object to be a "port"
          fromSpot: spot,
          toSpot: spot, // declare where links may connect at this port
          fromLinkable: output,
          toLinkable: input, // declare whether the user may draw links to/from here
          cursor: 'pointer' // show a different cursor to indicate potential link point
        })
      }

      let lastKey = 8
      diagram.nodeTemplate = $(
        go.Node,
        'Auto',
        {
          minSize: new go.Size(240, 80),
          selectable: true,
          selectionAdornmentTemplate: $(
            go.Adornment,
            'Auto',
            $(go.Shape, {
              fill: null,
              stroke: 'deepskyblue',
              strokeWidth: 1.5,
              strokeDashArray: [5, 2]
            })
          )
        },
        $(
          go.Panel,
          'Auto',
          {
            click: (e, obj) => {
              console.log('------------改------------', e, obj, obj.part.data)
            }
          },
          $(
            go.Shape,
            'RoundedRectangle',
            {
              stroke: '#d7d7d7',
              strokeWidth: 3,
              fill: '#fcfcfc'
              // portId: 'main'
            }
          ),
          $(
            go.TextBlock,
            new go.Binding('text', 'name')
          )
        ),
        $(
          go.Panel,
          'Auto',
          {
            alignment: go.Spot.TopRight,
            cursor: 'pointer',
            click: (e, obj) => {
              lastKey += 1
              diagram.model.addNodeData({
                key: lastKey,
                name: '新增流程',
                figure: 'WORKFLOW1',
                'status': 'success'
              })
              diagram.model.addLinkData({ 'from': obj.part.data.key, 'to': lastKey })
            }
          },
          $(go.Shape, 'Circle',
            {
              fill: null,
              stroke: null,
              width: 20,
              height: 20,
              portId: 'create'
            }
          ),
          $(go.TextBlock,
            {
              textAlign: 'center',
              stroke: '#FFF',
              margin: 2,
              minSize: new go.Size(10, NaN)
            },
            new go.Binding('text', '', () => '+')
          )
        ),
        $(
          go.Panel,
          'Auto',
          {
            alignment: go.Spot.BottomRight,
            cursor: 'pointer',
            click: (e, obj) => {
              diagram.model.removeNodeData(obj.part.data)
              let deleteLink = obj.part.findLinksConnected().map(link => {
                return link.data
              }) // 与这个节点有关的连接都删掉
              let into
              obj.part.findLinksInto().each(link => { // 上级节点
                into = link.data
              })
              obj.part.findLinksOutOf().each(link => { // 下级节点
                diagram.model.addLinkData({ 'from': into.from, 'to': link.data.to })
              })
              diagram.model.removeLinkDataCollection(deleteLink) // 删除多个连接
            }
          },
          $(go.Shape, 'Circle',
            {
              fill: null,
              stroke: null,
              width: 20,
              height: 20,
              portId: 'remove'
            }
          ),
          $(go.TextBlock,
            {
              textAlign: 'center',
              stroke: '#FFF',
              margin: 2,
              minSize: new go.Size(10, NaN)
            },
            new go.Binding('text', '', () => '×')
          )
        ),
        makePort('leftSpot', go.Spot.Left, true, true),
        makePort('rightSpot', go.Spot.Right, true, true),
        {
          mouseEnter: function (e, node, prev) {
            smallOperat(node, true)
          },
          mouseLeave: function (e, node, next) {
            smallOperat(node, false)
          }
        }
      )
      let colors = {
        'leftSpot': '#c4d9ea',
        'rightSpot': '#c4d9ea',
        'create': '#d9534f',
        'remove': '#5cb85c'
      }
      function smallOperat (node, show) {
        node.ports.each((port) => {
          if (port.portId) {
            port.fill = show ? colors[port.portId] : null
          }
        })
      }
      diagram.linkTemplate = $(
        go.Link,
        // { routing: go.Link.Bezier },
        $(
          go.Shape,
          {
            stroke: 'red',
            strokeWidth: 3
          },
          new go.Binding('stroke', 'status', (s) => {
            return s === 'error' ? '#d9534f' : '#5cb85c'
          })
        )
      )

      diagram.model = new go.GraphLinksModel(
        [
          { key: 1, name: '流程一', figure: 'WORKFLOW1' },
          { key: 2, name: '流程二(1)', figure: 'WORKFLOW2-1' },
          { key: 3, name: '流程二(2)', figure: 'WORKFLOW2-2' },
          { key: 4, name: '流程三', figure: 'WORKFLOW1' },
          { key: 5, name: '流程二(3)', figure: 'WORKFLOW2-1' },
          { key: 6, name: '流程二(4)', figure: 'WORKFLOW2-2' },
          { key: 7, name: '流程三', figure: 'WORKFLOW1' }
        ],
        [
          { from: 1, to: 2, 'scuss': 'error' },
          { from: 1, to: 3, 'status': 'success' },
          { from: 2, to: 4, 'status': 'error' },
          { from: 1, to: 5, 'status': 'success' },
          { from: 3, to: 6, 'status': 'success' },
          { from: 2, to: 7, 'status': 'error' },
          { from: 5, to: 6, 'status': 'success' }
        ]
      )

      this.diagram = diagram
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./gojs.less');
</style>
