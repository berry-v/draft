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
const $ = go.GraphObject.make
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
      let diagram = $(go.Diagram, 'workflow', { // 创建画布
        grid: $(go.Panel, 'Grid', // 背景网格线
          $(go.Shape, 'LineH', {// 浅灰色线(横向)
            stroke: '#999',
            strokeWidth: 0.5
          }),
          $(go.Shape, 'LineH', { // 十格后一根黑色线(横向)
            stroke: '#000',
            strokeWidth: 0.5,
            interval: 10
          }),
          $(go.Shape, 'LineV', {// 浅灰色网格(纵向)
            stroke: '#999',
            strokeWidth: 0.5
          }),
          $(go.Shape, 'LineV', { // 十格后一根黑色线(纵向)
            stroke: '#000',
            strokeWidth: 0.5,
            interval: 10
          })
        ),
        'grid.visible': true, // 画布上面是否出现网格
        'grid.gridCellSize': new go.Size(10, 10), // 每个小格子的尺寸
        allowDrop: true, // 获取或设置用户是否可以结束此图中的拖放操作
        // allowZoom: false, //是否允许用户更改图表的刻度
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
        // 'relinkingTool.fromHandleArchetype': $(go.Shape, 'Diamond', { // 起始连接点
        //   segmentIndex: 0,
        //   cursor: 'pointer',
        //   desiredSize: new go.Size(15, 15),
        //   fill: '#000',
        //   stroke: '#000'
        // }),
        // 'relinkingTool.toHandleArchetype': $(go.Shape, 'Diamond', { // 结束连接点
        //   segmentIndex: -1,
        //   cursor: 'pointer',
        //   desiredSize: new go.Size(15, 15),
        //   fill: 'red',
        //   stroke: 'red'
        // }),
        // 'linkReshapingTool.handleArchetype': $(go.Shape, 'Diamond', { // 中间连接点
        //   desiredSize: new go.Size(17, 17),
        //   fill: 'black',
        //   stroke: 'black'
        // }),
        layout: $(go.LayeredDigraphLayout, {
          angle: 0, // 旋转度数
          layerSpacing: 60 // 节点横向间隔
        })// go.LayeredDigraphLayout  go.TreeLayout

      })

      let makePort = (name, spot, output, input) => { // 连接点
        // 默认情况下看不到, 通过 showSmallPorts 设置为半透明灰色，定义如下
        return $(go.Shape, 'Rectangle', {
          fill: null,
          stroke: null,
          desiredSize: new go.Size(10, 10),
          alignment: spot, // 将端口与容器对齐
          alignmentFocus: spot, // 在容器里面
          portId: name, // 将此对象声明为“端口”
          fromSpot: spot,
          toSpot: spot, // 声明链接在此端口的连接位置
          fromLinkable: output,
          toLinkable: input, // 声明用户是否可以从此处绘制链接
          cursor: 'pointer' // 鼠标移动到端口上显示手型
        })
      }

      // let lastKey = 8
      diagram.nodeTemplate = $(go.Node, 'Auto', { // 节点模板
        minSize: new go.Size(200, 80),
        selectable: true,
        selectionAdornmentTemplate: $(go.Adornment, 'Auto', // 选中样式
          $(go.Shape, {
            height: 76,
            width: 5,
            fill: 'blue',
            margin: 2,
            stroke: null
          })
        )
      },
      $(go.Panel, 'Auto',
        {
          click: (e, obj) => {
            console.log('------------改------------', e, obj, obj.part.data)
          }
        },
        $(go.Shape, 'RoundedRectangle', { // 边框
          stroke: '#999',
          strokeWidth: 3,
          fill: '#fcfcfc'
        }),
        $(go.TextBlock, new go.Binding('text', 'name')) // 中间文字
      ),
        // $(go.Panel, 'Auto', // 添加图标
        //   {
        //     alignment: go.Spot.TopRight,
        //     cursor: 'pointer',
        //     click: (e, obj) => {
        //       lastKey += 1
        //       diagram.model.addNodeData({
        //         key: lastKey,
        //         name: '新增流程',
        //         figure: 'WORKFLOW1',
        //         'status': 'success'
        //       })
        //       diagram.model.addLinkData({ 'from': obj.part.data.key, 'to': lastKey })
        //     }
        //   },
        //   $(go.Shape, 'Circle', {
        //     fill: null,
        //     stroke: null,
        //     width: 20,
        //     height: 20,
        //     portId: 'create'
        //   }),
        //   $(go.TextBlock, {
        //     textAlign: 'center',
        //     stroke: '#FFF',
        //     margin: 2,
        //     minSize: new go.Size(10, NaN)
        //   }, new go.Binding('text', '', () => '+'))
        // ),
        // $(go.Panel, 'Auto', // 移除图标
        //   {
        //     alignment: go.Spot.BottomRight,
        //     cursor: 'pointer',
        //     click: (e, obj) => {
        //       diagram.model.removeNodeData(obj.part.data)
        //       let deleteLink = obj.part.findLinksConnected().map(link => {
        //         return link.data
        //       }) // 与这个节点有关的连接都删掉
        //       let into
        //       obj.part.findLinksInto().each(link => { // 上级节点
        //         into = link.data
        //       })
        //       obj.part.findLinksOutOf().each(link => { // 下级节点
        //         diagram.model.addLinkData({ 'from': into.from, 'to': link.data.to })
        //       })
        //       diagram.model.removeLinkDataCollection(deleteLink) // 删除多个连接
        //     }
        //   },
        //   $(go.Shape, 'Circle',
        //     {
        //       fill: null,
        //       stroke: null,
        //       width: 20,
        //       height: 20,
        //       portId: 'remove'
        //     }
        //   ),
        //   $(go.TextBlock,
        //     {
        //       textAlign: 'center',
        //       stroke: '#FFF',
        //       margin: 2,
        //       minSize: new go.Size(10, NaN)
        //     },
        //     new go.Binding('text', '', () => '×')
        //   )
        // ),
      makePort('leftSpot', go.Spot.Left, true, true),
      makePort('rightSpot', go.Spot.Right, true, true),
      {
        mouseEnter: function (e, node, prev) {
          smallOperat(node, true)
        },
        mouseLeave: function (e, node, next) {
          smallOperat(node, false)
        }
      })
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

      diagram.model = new go.GraphLinksModel( // 模型数据
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
