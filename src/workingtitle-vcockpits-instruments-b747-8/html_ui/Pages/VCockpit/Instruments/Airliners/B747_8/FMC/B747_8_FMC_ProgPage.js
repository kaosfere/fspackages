class FMCProgPage {

    static calcDistance(currentDistance, currentWaypoint, newWaypoint) {
        let waypointDistance = Avionics.Utils.computeDistance(currentWaypoint.infos.coordinates, newWaypoint.infos.coordinates);
        return currentDistance + waypointDistance;
    }
    static calcETEseconds(distance, currGS) {
        return (distance / currGS) * 3600;
    }
    static ShowPage(fmc) { //PROG
        fmc.clearDisplay();

        fmc.registerPeriodicPageRefresh(() => {

        fmc.setTemplate([
            ["PROGRESS[color]blue", "1/2[color]blue"],
            ["LAST", "DIST[color]blue", "ETE[color]blue", "FUEL-LB[color]blue"],
            ["-----[color]blue", "----[color]blue", ""],
            ["TO[color]blue"],
            ["-----[color]green", "----[color]green", "--:--[color]green", "1100"],
            ["NEXT[color]blue"],
            ["-----", "----", "--:--", "1140"],
            ["DEST[color]blue"],
            ["-----", "----", "--:--", "730"],
            ["ALTN[color]blue"],
            ["----", "----", "--:--", "570"],
            ["NAVIGATION[color]blue"],
            ["DME/DME GPS1[color]green"]
        ]);
        if (fmc.flightPlanManager.getDestination()) {     
            
            let currPos = new LatLong(SimVar.GetSimVarValue("GPS POSITION LAT", "degree latitude"), SimVar.GetSimVarValue("GPS POSITION LON", "degree longitude"));
            let groundSpeed = SimVar.GetSimVarValue("GPS GROUND SPEED", "knots");
            let prevWaypoint = fmc.flightPlanManager.getPreviousActiveWaypoint();
            let activeWaypoint = fmc.flightPlanManager.getActiveWaypoint();
            let destination = fmc.flightPlanManager.getDestination();

            let activewptdist = fmc.flightPlanManager.getDistanceToActiveWaypoint();
            let activewptete = groundSpeed < 50 ? "--:--"
                : new Date(fmc.flightPlanManager.getETEToActiveWaypoint() * 1000).toISOString().substr(11, 5);
        
            let nextWaypoint = fmc.flightPlanManager.getNextActiveWaypoint();
            let nextWaypointdist = this.calcDistance(activewptdist, activeWaypoint, nextWaypoint);
            let nextwptete = groundSpeed < 50 ? "--:--"
            : new Date(this.calcETEseconds(nextWaypointdist, groundSpeed) * 1000).toISOString().substr(11, 5);
            
            let destinationDistance = fmc.flightPlanManager.getDestination().cumulativeDistanceInFP
                - fmc.flightPlanManager.getPreviousActiveWaypoint().cumulativeDistanceInFP
                - Avionics.Utils.computeDistance(currPos,prevWaypoint.infos.coordinates);
            let destete = groundSpeed < 50 ? "--:--"
                : new Date(this.calcETEseconds(destinationDistance, groundSpeed) * 1000).toISOString().substr(11, 5);
            
            let prevWaypointdist = Avionics.Utils.computeDistance(currPos,prevWaypoint.infos.coordinates);

            fmc.setTemplate([
                ["PROGRESS[color]blue"],
                ["LAST", "DIST[color]blue", "ETE[color]blue", "FUEL-LB[color]blue"],
                [[prevWaypoint.ident] + "[color]blue", Math.trunc([prevWaypointdist]) + "[color]blue", ""],
                ["TO[color]blue"],
                [[activeWaypoint.ident] + "[color]green", Math.trunc([activewptdist]) + "[color]green", [activewptete] + "[color]green", "1100"],
                ["NEXT[color]blue"],
                [[nextWaypoint.ident] + "", Math.trunc([nextWaypointdist]) + "", [nextwptete] + "", "1140"],
                ["DEST[color]blue"],
                [[destination.ident] + "", Math.trunc([destinationDistance]) + "", [destete] + "", "730"],
                ["ALTN[color]blue"],
                ["----", "----", "--:--", "570"],
                ["NAVIGATION[color]blue"],
                ["DME/DME GPS1[color]green"]
            ]);
        }

        }, 1000, true);
        fmc.onLeftInput[5] = () => { B747_8_FMC_InitRefIndexPage.ShowPage1(fmc); };
        fmc.onRightInput[5] = () => { };
        fmc.onPrevPage = () => { FMCProgPage.ShowPage(fmc); };
        fmc.onNextPage = () => { FMCProgPage.ShowPage(fmc); };
        //fmc.updateSideButtonActiveStatus();
    }




}
//# sourceMappingURL=B747_8_FMC_PosInitPage.js.map