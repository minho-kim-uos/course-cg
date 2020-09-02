import {build_shader_without_uniforms} from "./module_shader.js"

"use stricrt";

function main()
{
    const loc_aPosition = 7;

    const src_vert = 
    `#version 300 es
        layout(location=${loc_aPosition}) in vec4 aPosition;
        void main()
        {
            gl_Position = aPosition;
        }
    `;
    const src_frag = 
    `#version 300 es
        precision mediump float;
        out vec4 fColor;
        void main()
        {
            fColor = vec4(0.0, 0.0, 1.0, 1.0);
        }
    `;

    // Getting the WebGL2 context
    const canvas = document.getElementById('webgl2');
    const gl = canvas.getContext("webgl2");

    let h_prog;

    try {
        h_prog = build_shader_without_uniforms(gl, src_vert, src_frag);
    }
    catch(e) {
        console.log(e.message);
        return;
    }

    const vertices = new Float32Array([
                         0.0,  0.9,
                        -0.9, -0.9,
                         0.9, -0.9]);

    // Setting up the geometry data
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const vbo = gl.createBuffer();

    // From which VBO to retrieve the geometry data? --> stored in the VAO
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);    
    // Upload the geometry data
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // In which pattern are vertex position data (specified by loc_aPosition)
    // stored in the buffer? --> stored in the VAO
    gl.vertexAttribPointer(loc_aPosition, 2, gl.FLOAT, false, 0, 0);
    // Enable the attribute specified by loc_aPosition --> stored in the VAO
    gl.enableVertexAttribArray(loc_aPosition);

    gl.bindVertexArray(null);   // Unbind the VAO
    
    // After unbinding the VAO, the followings don't affect 
    // the states stored in the VAO.
    gl.disableVertexAttribArray(loc_aPosition); 
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // In general, the following lines are called in an infinite loop. 
    // (called "rendering loop")
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(h_prog);
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindVertexArray(null);

}

main();
