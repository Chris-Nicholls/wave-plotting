var clamp = function(min, max, data){
	return Math.min(max, Math.max(min, data));
}

var wrap = function(max, x){
	if (x > max) {
		return x - max;
	} 
	return x;
}

var waves = function(data, dt) {
	
	var damping = 800;
	var adjustRate = 0.5;

	var pl = 0, pu = 0,
		vl=0, vu = 0, 
		weight = 1000*2*Math.PI, 
		el = 0, eu =0,
		angle = 0
		prev = data[0][1]

        var dw = 0.1;

	var half = data.map((x) => {
        var ef = Math.exp(-(el+eu)/60)
        var ef = 8/(1+el+eu)
        var wl = weight*(1-dw*ef)
        var wu = weight*(1+dw*ef)

		var ft = x[1]
		var df = (ft - prev)

        vl = vl*(1-damping*dt) + df - pl*wl*wl*dt
        vu = vu*(1-damping*dt) + df - pu*wu*wu*dt 
        
        pl = (pl + vl*dt)
        pu = (pu + vu*dt)

        el =  (vl*vl + pl*pl*wl*wl)// *dt/er + energy*(1-dt/er)
        eu =  (vu*vu + pu*pu*wu*wu)
       
        angle = wrap(2*Math.PI, angle + weight*dt)
        weight = weight + adjustRate*(eu-el)*ef
      
        prev = ft
        return [pl*500,pu*500,el/weight*60,eu/weight*60, weight/(1000*2*Math.PI)]
	})

    console.log(weight/(2*Math.PI))
	return half;
}

/**

follow :: Args -> Double ->WaveParams -> [Double] -> [WaveParams]   
follow Args{..} dt = scanl step
    where
        step  Params{..} ft = 
            Params (n+1) ft newPos newVelocity newWeight newEnergy newAngle newFiltered newAAvg
            where
                df = (ft - prev)
                dft = (df/dt)*(df/dt)
                v2 = velocity*velocity
                forceFactor = if (dft + v2 ==0) then 0 else  (dft -v2)/(dft+v2)
                newVelocity = clamp (-100) (100) $ velocity + df*abs(forceFactor) - (pos*weight*weight+velocity*weight*weight*damping/1000)*dt                
                newPos = (pos + (velocity+newVelocity)/2*dt)
                newEnergy =  (newVelocity*newVelocity + newPos*newPos*weight*weight) *dt/er + energy*(1-dt/er)
                newAngle = wrap (2*pi) (angle + weight*dt)
                r = 0.9
                adj = if (forceFactor < 0) then df*newPos else 0
                    
                newAAvg = adjustAvg*r +(1-r)*adj  
                newWeight = weight*(1-adjustRate*newAAvg)
                
                alpha = 1/(1+dt*weight*0.1)
            
                newFiltered = filtered*alpha +df



follow :: Args -> Double ->WaveParams -> [Double] -> [WaveParams]   
follow Args{..} dt = scanl step
    where
        step  Params{..} ft = 
            Params (n+1) ft newPos newVelocity newWeight newEnergy newAngle newFiltered newAAvg
            where
                df = (ft - prev)
                reduction =   exp(-energy*energy/100000) -- * abs ft
                newVelocity = clamp (-10) (10) $ velocity -dt*velocity*damping + df - (pos+velocity*dt)*weight*weight*dt*1.00
                newPos = (pos + (velocity+newVelocity)/2*dt)
                newEnergy =  (newVelocity*newVelocity + newPos*newPos*weight*weight) *dt/er + energy*(1-dt/er)
                newAngle = wrap (2*pi) (angle + weight*dt)
                r = 1-damping
                adj = df * newPos   + dt/100
                    
                newAAvg = adjustAvg*r +(1-r)*adj  
                newWeight = weight*(1-adjustRate*newAAvg)
                
                alpha = 1/(1+dt*weight*0.1)
            
                newFiltered = filtered*alpha +df

**/