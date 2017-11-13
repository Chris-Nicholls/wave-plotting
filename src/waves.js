var waves = function(data, dt) {
    
    var damping = 800;
    var adjustRate = 10000000;

    var pl = 0, pu = 0,
        vl=0, vu = 0, 
        weight = 1000*2*Math.PI, 
        el = 0, eu =0,
        angle = 0
        prev = data[0][1]

        var dw = 0.1;

    var half = data.map((x) => {
        var ef = 8/(1+(el+eu)*6000*6000)
        var wl = weight*(1-dw*ef)
        var wu = weight*(1+dw*ef)

        var ft = x[1]
        var df = (ft - prev)

        vl = vl*(1-damping*dt) + df - pl*wl*wl*dt
        vu = vu*(1-damping*dt) + df - pu*wu*wu*dt 
        
        pl = (pl + vl*dt)
        pu = (pu + vu*dt)

        el =  (vl*vl/(wl*wl) + pl*pl)
        eu =  (vu*vu/(wu*wu) + pu*pu)
       
        angle = (angle + weight*dt)%(2*Math.PI)
        weight = weight + adjustRate*(eu-el)*ef
      
        prev = ft
        return [pl*1000,pu*1000,el*100000,eu*100000, weight/(1000*2*Math.PI)]
    })

    console.log(weight/(2*Math.PI))
    return half;
}
