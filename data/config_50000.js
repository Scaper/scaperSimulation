import trips_18000_19800 from './trips_50000/18000_19800.json'
import trips_19800_21600 from './trips_50000/19800_21600.json'
import trips_21600_23400 from './trips_50000/21600_23400.json'
import trips_23400_25200 from './trips_50000/23400_25200.json'
import trips_25200_27000 from './trips_50000/25200_27000.json'
import trips_27000_28800 from './trips_50000/27000_28800.json'
import trips_28800_30600 from './trips_50000/28800_30600.json'
import trips_30600_32400 from './trips_50000/30600_32400.json'
import trips_32400_34200 from './trips_50000/32400_34200.json'
import trips_34200_36000 from './trips_50000/34200_36000.json'
import trips_36000_37800 from './trips_50000/36000_37800.json'
import trips_37800_39600 from './trips_50000/37800_39600.json'
import trips_39600_41400 from './trips_50000/39600_41400.json'
import trips_41400_43200 from './trips_50000/41400_43200.json'
import trips_43200_45000 from './trips_50000/43200_45000.json'
import trips_45000_46800 from './trips_50000/45000_46800.json'
import trips_46800_48600 from './trips_50000/46800_48600.json'
import trips_48600_50400 from './trips_50000/48600_50400.json'
import trips_50400_52200 from './trips_50000/50400_52200.json'
import trips_52200_54000 from './trips_50000/52200_54000.json'
import trips_54000_55800 from './trips_50000/54000_55800.json'
import trips_55800_57600 from './trips_50000/55800_57600.json'
import trips_57600_59400 from './trips_50000/57600_59400.json'
import trips_59400_61200 from './trips_50000/59400_61200.json'
import trips_61200_63000 from './trips_50000/61200_63000.json'
import trips_63000_64800 from './trips_50000/63000_64800.json'
import trips_64800_66600 from './trips_50000/64800_66600.json'
import trips_66600_68400 from './trips_50000/66600_68400.json'
import trips_68400_70200 from './trips_50000/68400_70200.json'
import trips_70200_72000 from './trips_50000/70200_72000.json'
import trips_72000_73800 from './trips_50000/72000_73800.json'
import trips_73800_75600 from './trips_50000/73800_75600.json'
import trips_75600_77400 from './trips_50000/75600_77400.json'
import trips_77400_79200 from './trips_50000/77400_79200.json'
import trips_79200_81000 from './trips_50000/79200_81000.json'
import trips_81000_82800 from './trips_50000/81000_82800.json'
import trips_82800_84600 from './trips_50000/82800_84600.json'
function toStructure(triparray)
{
    var out = triparray.map(t => 
    {
     return {"Positions" : new Float32Array(t.Positions),
     "Timestamps": new Float32Array(t.Timestamps),
     "idx" : new Uint32Array(t.idx),
      "tmin" : t.tmin,
      "tmax" : t.tmax
    }
    }
    );
    return out
} 

const data=toStructure([trips_18000_19800
,trips_19800_21600
,trips_21600_23400
,trips_23400_25200
,trips_25200_27000
,trips_27000_28800
,trips_28800_30600
,trips_30600_32400
,trips_32400_34200
,trips_34200_36000
,trips_36000_37800
,trips_37800_39600
,trips_39600_41400
,trips_41400_43200
,trips_43200_45000
,trips_45000_46800
,trips_46800_48600
,trips_48600_50400
,trips_50400_52200
,trips_52200_54000
,trips_54000_55800
,trips_55800_57600
,trips_57600_59400
,trips_59400_61200
,trips_61200_63000
,trips_63000_64800
,trips_64800_66600
,trips_66600_68400
,trips_68400_70200
,trips_70200_72000
,trips_72000_73800
,trips_73800_75600
,trips_75600_77400
,trips_77400_79200
,trips_79200_81000
,trips_81000_82800
,trips_82800_84600
])
export {data}