export function build_shader_without_uniforms(gl, src_vert, src_frag) {

    function compile_shader(gl, type, src) {
        const h_shader = gl.createShader(type);
        const type_str = type==gl.VERTEX_SHADER?"vertex":"fragment";
        if (!h_shader) {
            throw new Error(`Failed to create a ${type_str} shader`);
        }
        gl.shaderSource(h_shader, src);
        gl.compileShader(h_shader);
        let status = gl.getShaderParameter(h_shader, gl.COMPILE_STATUS);
        if (!status) {
            let error = gl.getShaderInfoLog(h_shader);
            gl.deleteShader(h_shader);
            throw new Error(`Failed to compile the ${type_str} shader: ${error}`);
        }
        return h_shader;
    }
    
    let h_prog, h_vert, h_frag;

    try {
        h_vert = compile_shader(gl, gl.VERTEX_SHADER, src_vert);
        h_frag = compile_shader(gl, gl.FRAGMENT_SHADER, src_frag);
    
        h_prog = gl.createProgram();
        if(!h_prog) throw new Error(`Failed to create a shader program`); 
        gl.attachShader(h_prog, h_vert);
        gl.attachShader(h_prog, h_frag);
    
        gl.linkProgram(h_prog);

        let status = gl.getProgramParameter(h_prog, gl.LINK_STATUS);
        if (!status) {
            let error = gl.getProgramInfoLog(h_prog);
            throw new Error(`Failed to link the program: ${error}`);
        }
        return h_prog;
    }
    catch(e) {
        gl.deleteProgram(h_prog);
        gl.deleteShader(h_vert);
        gl.deleteShader(h_frag);
        throw e;
    }
}


