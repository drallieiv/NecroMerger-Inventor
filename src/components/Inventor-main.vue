<script lang="ts">
  export default {
    data() {
      return {
        upgrades: [
          {id: 1, title: "Time Shard Experiment", desc:"Get more Time Shards from using the Time Machine.", image:"Experiments_2.png", levels: [
            {cost: 100,   effect: "0% » 75%"},
            {cost: 5000,  effect: "75% » 150%"},
            {cost: 15000, effect: "150% » 225%"},
            {cost: 30000, effect: "225% » 300%"},
          ]},
          {id: 2, title: "Seasoning Experiment", desc:"Get more Food from Cravings.", image:"Experiments_3.png", levels: [
            {cost: 50,   effect: "0% » 20%"},
            {cost: 500,  effect: "20% » 40%"},
            {cost: 1000, effect: "40% » 60%"},
            {cost: 2000, effect: "60% » 80%"},
            {cost: 4000, effect: "80% » 100%"},
          ]},
          {id: 3, title: "Capacity Experiment", desc:"Increase Mana, Slime and Darkness Caps.", image:"Experiments_4.png", levels: [
            {cost: 100,  effect: "0% » 5%"},
            {cost: 750,  effect: "5% » 10%"},
            {cost: 1500, effect: "10% » 15%"},
            {cost: 2500, effect: "15% » 20%"},
            {cost: 5000, effect: "20% » 25%"},
          ]},
          {id: 4, title: "Strength Experiment", desc:"Increase all Damage.", image:"Experiments_5.png", levels: [
            {cost: 25,   effect: "0% » 10%"},
            {cost: 250,  effect: "10% » 20%"},
            {cost: 750,  effect: "20% » 30%"},
            {cost: 1500, effect: "30% » 40%"},
            {cost: 2500, effect: "40% » 50%"},
          ]},
          {id: 5, title: "Body Snatcher", desc:"Increase all Damage.", levels: [
            {cost: 50,  effect: ""},
          ]},
        ],
        selection: [],
      }
    },
    computed: {
      totalCost() {
        let total = 0;
        this.upgrades.forEach(upgrade => {
          let hasSelection = this.selection.find(s => s.id == upgrade.id);
          if (hasSelection) {
            let selectedLevel = hasSelection.lvl;
            upgrade.levels.forEach((lvl, index) => {
              if (index < selectedLevel) {
                total += lvl.cost;
              }
            })
          }
        });
        return total;
      }
    },
    methods: {
      formatCost: function(cost: number) {
        if (Math.round(cost / 1000) * 1000 == cost) {
          return Math.round(cost / 1000) + 'k';
        }
        return cost;        
      },
      selectUpgrade(upgradeId: string, level: number) {
        let prevSelection = this.selection.find(s => s.id == upgradeId);
        if (prevSelection) {
          if (prevSelection.lvl == level) {
            prevSelection.lvl = level - 1;  
          } else {
            prevSelection.lvl = level;
          }          
        } else {
          this.selection.push({id: upgradeId, lvl: level});
        }        
        console.log("selection", this.selection);
      },
      isActive(upgrade, level) {
        let selected = this.selection.find(s => s.id == upgrade.id);
        let isActive = selected && selected.lvl >= level;
        return isActive;
      }
    }
  }  
</script>

<template>
  <p>Here is an interactive tool based on https://necromerger.fandom.com/wiki/The_Inventor</p>

  <div class="inventorPlanner">
    <div class="inventorPlanner-table">
      <table>
        <thead>
          <th>Description</th>
          <th class="level" v-for="level in 5"> <img :src="'/img/Spellbook_L'+level+'.png'" width="64" height="36"> </th>
        </thead>
        <tbody>
          <tr v-for="upgrade in upgrades">
            <td>
              <img v-if="upgrade.image" :src="'img/' + upgrade.image" width="128" height="69">
              <br/>
              <b>{{upgrade.title}}</b>
              <br/>
              {{upgrade.desc}}
            </td>
            <td :class="{ 'selectable': upgrade.levels[level-1], 'active': isActive(upgrade,level) }" v-for="level in 5" @click="selectUpgrade(upgrade.id, level)">
              <div v-if="upgrade.levels[level-1]">
                <img src="/img/Time_Shard_Big.png" width="37" height="37">
                -{{ this.formatCost(upgrade.levels[level-1].cost) }}
                <p class="effect">{{upgrade.levels[level-1].effect}}</p>
              </div>
           </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="inventorPlanner-summary">
      <table>
        <thead>
          <th>Total Cost</th>
        </thead>
        <tbody>
          <tr>
            <td>
              <img src="/img/Time_Shard_Big.png" width="37" height="37">
              {{ this.formatCost(totalCost) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  #app {
    .inventorPlanner {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      line-height: 1.75;
      
      .inventorPlanner-table {
        flex-basis: 800px;
        table {
          width: 100%;
        }
        margin-bottom: 20px;
      }
      .inventorPlanner-summary {
        flex-basis: 300px;
        margin-bottom: 20px;
      }

      th.level {
        min-width: 80px;
      }

      td {
        text-align: center;

        &.selectable {
          cursor: pointer;
        }

        &.selectable.active {
          background-color: hsl(130, 70%, 15%);;
        }
        &.selectable:hover {
          background-color: hsl(130 70% 25%);;
        }
      }

      img {
        vertical-align: middle;
      }

      p.effect {
        font-size: smaller;
      }
    }
  }
</style>