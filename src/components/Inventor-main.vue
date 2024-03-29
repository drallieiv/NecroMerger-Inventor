<script setup lang="ts">
  import InventorShards from '@/components/Inventor-shards.vue'
  const version = APP_VERSION; 
</script>
<script lang="ts">

  class InventorData {
    public selection: Selection[] = [];

    constructor(public upgrades: Upgrade[], public inventions: Invention[]) {}
  }
  class UpgradeLevel { 
    constructor(public cost: number, public effect: string) {}
  }
  class Upgrade { 
    public id: number = 0;
    public title: string = '';
    public desc: string = '';
    public image?: string = '';
    public levels: UpgradeLevel[] = [];
    constructor(values: Object = {}) {
      Object.assign(this, values);
    }
  }
  class Invention { 
    constructor(public name: string, public requirement: number) {}
  }
  class Selection {
    constructor(public id: number, public lvl: number) {}
  }


  export default {
    created() {
      let hash = this.$route.hash.replace('#','');
      hash.split('').forEach((lvl, index) => {
        this.selectUpgrade(index+1, +lvl);
      })
    },
    data() {
      return new InventorData(
        [
          {id: 2, title: "Seasoning Experiment", desc:"Get more Food from Cravings.", image:"Experiments_3.png", levels: [
            new UpgradeLevel(50, "0% » 20%"),
            new UpgradeLevel(500, "20% » 40%"),
            new UpgradeLevel(1000, "40% » 60%"),
            new UpgradeLevel(2000, "60% » 80%"),
            new UpgradeLevel(4000, "80% » 100%"),
          ]},
          {id: 3, title: "Capacity Experiment", desc:"Increase Mana, Slime and Darkness Caps.", image:"Experiments_4.png", levels: [
            new UpgradeLevel(100,"0% » 5%"),
            new UpgradeLevel(750,"5% » 10%"),
            new UpgradeLevel(1500,"10% » 15%"),
            new UpgradeLevel(2500,"15% » 20%"),
            new UpgradeLevel(5000,"20% » 25%"),
          ]},
          {id: 4, title: "Strength Experiment", desc:"Increase all Damage.", image:"Experiments_5.png", levels: [
            new UpgradeLevel(25, "0% » 10%"),
            new UpgradeLevel(250,"10% » 20%"),
            new UpgradeLevel(750,"20% » 30%"),
            new UpgradeLevel(1500,"30% » 40%"),
            new UpgradeLevel(2500,"40% » 50%"),
          ]},
          {id: 5, title: "Body Snatcher", desc:"The Body Snatcher will start appearing in the Lair.", levels: [
            new UpgradeLevel(50, ""),
          ]},
          {id: 6, title: "Weakening Experiment", desc:"Reduce the Protector's health scale..", image:"Experiments_6.png", levels: [
            new UpgradeLevel(7500, "500% » 250%"),
            new UpgradeLevel(15000, "250% » 175%"),
            new UpgradeLevel(25000, "175% » 150%"),
            new UpgradeLevel(50000, "150% » 140%"),
          ]},
          {id: 7, title: "Ice Chest Experiment", desc:"Increase the number of uses for Ice Chests.", image:"Experiments_7.png", levels: [
            new UpgradeLevel(10, "+1"),
            new UpgradeLevel(500, "+2"),
            new UpgradeLevel(1500, "+3"),
            new UpgradeLevel(5000, "+4"),
            new UpgradeLevel(10000, "+5"),
          ]},
          {id: 8, title: "Poison Chest Experiment", desc:"Increase the number of uses for Poison Chests.", image:"Experiments_8.png", levels: [
            new UpgradeLevel(25, "+1"),
            new UpgradeLevel(1000, "+2"),
            new UpgradeLevel(3000, "+3"),
            new UpgradeLevel(7500, "+4"),
            new UpgradeLevel(12500, "+5"),
          ]},
          {id: 9, title: "Blood Chest Experiment", desc:"Increase the number of uses for Cosmic Chest.", image:"Experiments_9.png", levels: [
            new UpgradeLevel(50, "+1"),
            new UpgradeLevel(2500, "+2"),
            new UpgradeLevel(5000, "+3"),
            new UpgradeLevel(10000, "+4 (max)"),
          ]},
          {id: 10, title: "Moon Chest Experiment", desc:"Increase the number of uses for Cosmic Chest.", image:"Experiments_10.png", levels: [
            new UpgradeLevel(250, "+1"),
            new UpgradeLevel(3000, "+2"),
            new UpgradeLevel(7500, "+3"),
            new UpgradeLevel(15000, "+4 (max)"),
          ]},
          {id: 11, title: "Death Chest Experiment", desc:"Increase the number of uses for Death Chest.", image:"Experiments_11.png", levels: [
            new UpgradeLevel(500, "+1"),
            new UpgradeLevel(5000, "+2"),
            new UpgradeLevel(10000, "+3 (max)"),
          ]},
          {id: 12, title: "Cosmic Chest Experiment", desc:"Increase the number of uses for Cosmic Chest.", image:"Experiments_12.png", levels: [
            new UpgradeLevel(5000, "+1"),
            new UpgradeLevel(10000, "+2"),
            new UpgradeLevel(15000, "+3"),
          ]},
        ],
        [
          {name: "Serv-O", requirement: 250},
          {name: "Stab-O", requirement: 5000},
          {name: "Split-O", requirement: 20000},
        ]
      )
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
      },
      hash() {
        let max = this.upgrades.length + 1;
        let selectionArray: number[] = new Array(max);
        for (let i=0; i < max; i++) {
          selectionArray[i] = (this.selection.find(s => s.id - 1 == i) || new Selection(0, 0)).lvl;
        }
        return selectionArray.join('');
      },
      bookmarkLink() {
        return import.meta.env.BASE_URL.replace(/\/$/, '') + this.$route.fullPath
      }
    },
    methods: {
      formatCost: function(cost: number): string {
        if (cost >= 1000 && Math.round(cost / 100) * 100 == cost) {
          return Math.round(cost / 100) / 10 + 'k';
        }
        return cost.toLocaleString();        
      },
      selectUpgradeAndRefresh(upgradeId: number, level: number) {
        // Set value
        this.selectUpgrade(upgradeId, level);

        // Call hash update
        this.$router.replace({ hash: '#' + this.hash })
      },
      selectUpgrade(upgradeId: number, level: number) {
        let prevSelection = this.selection.find(s => s.id == upgradeId);
        if (prevSelection) {
          if (prevSelection.lvl == level) {
            prevSelection.lvl = level - 1;  
          } else {
            prevSelection.lvl = level;
          }          
        } else {
          this.selection.push(new Selection(upgradeId, level));
        }

      },
      clearAll() {
        this.selection = [];

        // Call hash update
        this.$router.replace({ hash: undefined })
      },
      isActive(upgrade:Upgrade, level:number): boolean {
        let selected = this.selection.find(s => s.id == upgrade.id);
        let isActive:boolean = !! selected && selected.lvl >= level;
        return isActive;
      }
    }
  }  
</script>

<template>
  <h1>Inventor Time Machine Helper</h1>
  <p>Here is an interactive tool based on <a href="https://necromerger.wiki.gg/wiki/The_Inventor">https://necromerger.wiki.gg/wiki/The_Inventor</a>.</p>
  <p>To bookmark or share this page with current values use this <a :href=bookmarkLink>link</a></p>

  <div class="inventorPlanner">
    <div class="inventorPlanner-table">
      <button @click="clearAll">Clear All</button>
      <div class="inventorPlanner-table-fit">
        <table>
          <thead>
            <th>Description</th>
            <th class="level" v-for="level in 5" v-bind:key="level"> <img class="img-level" :src="'img/Spellbook_L'+level+'.png'"> </th>
          </thead>
          <tbody>
            <tr v-for="upgrade in upgrades" v-bind:key="upgrade.id">
              <td>
                <div style="display: flex;flex-direction: row;align-items: flex-start;">
                  <div class="upgradeImg" v-if="upgrade.image" style="flex-basis: 128px">
                    <img :src="'img/' + upgrade.image" width="128" height="69">
                  </div>
                  <div style="flex-grow: 1; padding: 0 5px;">
                  <b>{{upgrade.title}}</b>
                  <span class="upgrade-desc">
                    <br/>
                    {{upgrade.desc}}
                  </span>
                  </div>
                </div>
              </td>
              <td 
                :class="{ 'selectable': upgrade.levels[level-1], 'active': isActive(upgrade,level) }" 
                v-for="level in 5" v-bind:key="level"
                @click="selectUpgradeAndRefresh(upgrade.id, level)">
                <div v-if="upgrade.levels[level-1]">
                  <img class="img-timeshard" src="/img/Time_Shard_Big.png" >
                  -{{ formatCost(upgrade.levels[level-1].cost) }}
                  <p class="effect">{{upgrade.levels[level-1].effect}}</p>
                </div>
            </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="inventorPlanner-summary">
      <table>
        <thead>
          <th>Total Cost</th>
        </thead>
        <tbody>
          <tr>
            <td>
              <img class="img-timeshard" src="/img/Time_Shard_Big.png" >
              {{ formatCost(totalCost) }}
            </td>
          </tr>
        </tbody>
      </table>
      <br/>
      <p class="jnote">Note: 15 additional shards must be used at first prestige for the Inventor to spawn the Time Machine</p>
      <br/>
      <table>
        <thead>
          <th>Inventions</th>
          <th>Requirement</th>
          <th>Unlocked</th>
        </thead>
        <tbody>
          <tr v-for="invention in inventions"  v-bind:key="invention.name">
            <td>{{invention.name}}</td>
            <td>
              <img class="img-timeshard" src="/img/Time_Shard_Big.png" >
              {{ formatCost(invention.requirement) }}
            </td>
            <td style="font-weight:bold;">
              {{ (totalCost >= invention.requirement) ? "yes" : "no"}}
            </td>
          </tr>
        </tbody>
      </table>
      <!--
        <br/>
        <InventorShards/>
      -->
    </div>
  </div>
  <div class="footer">App version : {{ version }}</div>
</template>

<style lang="scss">
  #app {

    p {
      margin-block-start: .5em;
      margin-block-end: .5em;
      line-height: 1;
    }

    p.jnote {
      text-align: justify;
    }

    div.inventorPlanner-table-fit {
      margin: 5px 0;
    }

    table {
      margin: auto;
    }

    .inventorPlanner {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      line-height: 1.75;

      @media screen and (max-width: 900px) {
        line-height: 1.2;
      }
      
      .inventorPlanner-table {
        flex-basis: 900px;
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
        @media screen and (max-width: 900px) {
          min-width: 50px;
        }
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
        &.selectable:hover.active {
          background-color: hsl(130 70% 5%);;
        }
      }

      img {
        vertical-align: middle;

        &.img-timeshard {
          width: 25px;
          height: 25px;
        }

        &.img-level {
          width: 64px;
          height: 36px;
        }

        @media screen and (max-width: 900px) {
          &.img-timeshard {
            width: 16px;
            height: 16px;
          }

          &.img-level {
            width: 32px;
            height: 18px;
          }
        }

      }

      p.effect {
        font-size: smaller;
      }
    }

    .footer {
      text-align: right;
    }

    @media screen and (max-width: 900px) {
      div.upgradeImg {
        display: none;
      }

      font-size: .8em;
    }

    @media screen and (max-width: 700px) {
      span.upgrade-desc {
        display: none;
      }
    }

    

  }
</style>
