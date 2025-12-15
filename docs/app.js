async function init() {
  // 1. 特征检测
  if (!navigator.gpu) {
    console.error('❌ WebGPU not supported in your browser!');
    return;
  } else {
    console.log(`✅ WebGPU is supported!`);
  }
  // 2. get adapter
  const adapter = await navigator.gpu.requestAdapter();
  // 3. get device
  const device = await adapter.requestDevice();
  // 4. get format
  const format = navigator.gpu.getPreferredCanvasFormat();

  const canvas = document.getElementById('canvas');
  // 5. get context
  const context = canvas.getContext('webgpu');
  context.configure({ device, format });
  // command encoder
  const encoder = device.createCommandEncoder();
  // view
  const view = context.getCurrentTexture().createView();
  // pass
  const pass = encoder.beginRenderPass({
    colorAttachments: [
      {
        view,
        // clearValue: { r: 0.1, g: 0.2, b: 0.3, a: 1.0 },
        // RGBA 颜色通道
        clearValue: {
          r: 0,
          g: 0.7,
          b: 0,
          a: 0.7
        },
        loadOp: 'clear',
        storeOp: 'store',
      },
      // {
      //   view,
      //   clearValue: {
      //     r: 1,
      //     g: 0,
      //     b: 0,
      //     a: 0.7
      //   },
      //   loadOp: 'clear',
      //   storeOp: 'store',
      // },
    ],
    // colorAttachments: [{
    //   view,
    //   // clearValue: { r: 0.1, g: 0.2, b: 0.3, a: 1.0 },
    //   clearValue: {
    //     r: 1,
    //     g: 0,
    //     b: 0,
    //     a: 0.7
    //   },
    //   loadOp: 'clear',
    //   storeOp: 'store',
    // }],
  });
  pass.end();
  // queue
  device.queue.submit([encoder.finish()]);
}

export {
  init,
};

// init();


/* 

该 init 异步函数用于初始化 WebGPU 渲染流程，实现了最基础的清屏操作。首先，函数会进行特征检测，判断当前浏览器是否支持 WebGPU。如果不支持，则输出错误信息并终止执行；如果支持，则继续后续流程。

接下来，函数通过 navigator.gpu.requestAdapter() 获取 GPU 适配器（adapter），再通过 adapter.requestDevice() 获取逻辑设备（device）。然后，使用 navigator.gpu.getPreferredCanvasFormat() 获取推荐的画布格式，确保后续渲染格式与平台兼容。

函数通过 document.getElementById('canvas') 获取页面上的 canvas 元素，并调用 canvas.getContext('webgpu') 获取 WebGPU 上下文（context），随后用获取到的 device 和 format 对 context 进行配置。之后，创建命令编码器（encoder），并通过 context.getCurrentTexture().createView() 获取当前帧的纹理视图（view）。

在渲染流程中，函数调用 encoder.beginRenderPass 开启一个渲染通道（render pass），并设置 colorAttachments，指定清屏颜色为半透明绿色（r: 0, g: 0.7, b: 0, a: 0.7），loadOp 为 'clear'，storeOp 为 'store'。本例中没有绘制任何图形，直接结束渲染通道（pass.end()），最后通过 device.queue.submit([encoder.finish()]) 提交命令缓冲区，完成一次清屏操作。

注意事项：实际开发中建议对 adapter、device、canvas、context 等对象增加判空处理，避免因获取失败导致报错。此外，colorAttachments 数组中每个元素应对应不同的纹理视图，不能重复引用同一个 view。若需不透明背景，可将 clearValue 的 a 设为 1.0，并设置 alphaMode 为 'opaque'。




*/
