export default {
      data: [
        {
          Id: "0d728ffc-b73c-4c14-b780-4eb88b907f0f",
          Type: "recipe",
          Location: "recipes",
          Descriptor: {
            Process: "FLA",
            TestsOrder: [
              "a4fd99b1-2f5b-415d-b57a-bbc260621503",
              "4ec900cb-f122-4b4b-990c-cb8ef9923e56",
              "6c7f915c-a3c6-4fcf-8015-77195447f1ed",
              "8d5a588b-26a3-4d03-ab70-3f5ad332e488",
              "6cbe5ffe-5d92-46dc-8d4e-51f5cedc7275",
            ],
          },
          TestsImpacted: [],
        },
        {
          Id: "f09b8fc8-1aa6-463d-bd8e-2c8359aebe92",
          Type: "recipe",
          Location: "recipes",
          Descriptor: {
            Process: "BAT",
            TestsOrder: ["293fb6c9-e401-45d6-a8c4-fe25d49da0f3"],
          },
          TestsImpacted: [],
        },
        {
          Id: "c934c7dc-dedc-4279-a0d5-3e593d7105ce",
          Type: "recipe",
          Location: "recipes",
          Descriptor: {
            Process: "FCT",
            TestsOrder: ["6e2d0d38-5c79-4790-aeda-65b0bf277f7a"],
          },
          TestsImpacted: [],
        },
        {
          Id: "7d916036-b6c5-44f0-adac-a82ef65c2c23",
          Type: "operator",
          Location: "",
          Descriptor: {
            Content: [
              {
                Id: "test-0",
                Process: "",
                Command: "",
                Content: "This is the header",
              },
              {
                Id: "45594c95-b9dd-424e-8069-8a5172efa294",
                Process: "",
                Command: "",
                Content: "This is the header",
              },
              {
                Id: "test-1",
                Process: "FLA",
                Command:
                  './run.sh --pbr=PB-xxxxx --factory=FXLH --process=FCT --server="xxx.xxx.xxx.xxx" --fixture="XXXXX"',
                Content:
                  "For FLA (Flashing VBIOS/OBD, single board setup):\n\n            Generate PESG.csv files for each board and put it under the core/mods folder of 618 diag package. \n            Download the VBIOS file and put them under the core/mods folder of 618 diag package.\n            Make sure to modify ./recipe/recipe_fla.xml {{SN}}_bios.rom to use the correct VBIOS. \n            \n            \n            Separate Error codes on flash station for flashing VBIOS data failures as below will be output to output.txt of Nautilus log.\n            --EC000501 for VBIOS flash failure",
              },
              {
                Id: "6df5909a-e8e8-4128-9f34-754039c7c636",
                Process: "FLA",
                Command:
                  './run.sh --pbr=PB-xxxxx --factory=FXLH --process=FCT --server="xxx.xxx.xxx.xxx" --fixture="XXXXX"',
                Content:
                  "For FLA (Flashing VBIOS/OBD, single board setup):\n\n            Generate PESG.csv files for each board and put it under the core/mods folder of 618 diag package. \n            Download the VBIOS file and put them under the core/mods folder of 618 diag package.\n            Make sure to modify ./recipe/recipe_fla.xml {{SN}}_bios.rom to use the correct VBIOS. \n            \n            \n            Separate Error codes on flash station for flashing VBIOS data failures as below will be output to output.txt of Nautilus log.\n            --EC000501 for VBIOS flash failure",
              },
              {
                Id: "6e9316da-da51-4d8f-8bd2-270611387b19",
                Process: "",
                Command: "",
                Content: "This is the header",
              },
              {
                Id: "test-2",
                Process: "FCT",
                Command:
                  './run.sh --pbr=PB-xxxxx --factory=FXLH --process=FCT --server="xxx.xxx.xxx.xxx" --fixture="XXXXX"',
                Content:
                  'For FCT (Single boards setup,it will run BAT+PCS+FTA+TSE+FTB+T275):\n\n            Connect a panel to any on-board display port (integrated graphic) on MB for display (set SBIOS for using on-board display). \n            Insert one board to the first PCIe 16x slot (nearest from the CPU) of the system. \n                        \n            Run "./run.sh --pbr=PB-xxxxx --factory=FXLH --process=FCT --server="xxx.xxx.xxx.xxx" --fixture="XXXXX""\n            \n            PB-XXXXX is PB No.',
              },
              {
                Id: "test-3",
                Process: "IOT",
                Command:
                  './run.sh --pbr=PB-xxxxx --factory=FXLH --process=IOT --server="xxx.xxx.xxx.xxx" --fixture="XXXXX"',
                Content:
                  'For IOT(it will test all 4 display ports(1HDMI+3DP ports,Single board setup with PW or MF51 platform)\n\n            Connect a panel to any on-board display port (integrated graphic) on MB for display (set SBIOS for using on-board display). \n            Insert the board to the first PCIe slot (nearest from the CPU) of the system. \n            \n            Connection to Display Switch Box (e.g., DYLINK SW8201DH)\n            For the board at PCIEX_1 slot\n            \n            Use DP cable to connect DP1 connector to Port1 of switch box.\n            Use DP cable to connect DP2 connector to Port2 of switch box.\n            Use DP cable to connect DP3 connector to Port3 of switch box.\n            Use HDMI cable to connect HDMI connector to Port9 of switch box.\n            \n            \n            Use 1 HDMI cable to connect 1 HDMI CRC tester to "MONITOR"(HDMI) Output of switch box.\n            Use 1 DP cable to connect 1 DP CRC tester to "MONITOR"(DP) Output of switch box.\n            \n            Note:\n            Make sure to connect USB/RS-232 cable between Display switch box and the motherboard.',
              },
            ],
            FileName: "operator.txt",
          },
          TestsImpacted: [],
        },
        {
          Id: "7377da96-0343-4490-be0c-47caec48bc52",
          Type: "manifest",
          Location: "configs",
          Descriptor: {
            Content: {
              Config: {
                DiagInfo: {
                  Name: "618-1G142-0020-MFG-31418",
                  Author: "cicao",
                  Version: "1",
                  Comment: "Initiate version",
                },
                Prepare: {
                  ModsFinder: {
                    Enabled: true,
                    Paths: [
                      "./core/*[E0-9]*.tgz",
                      "./core/mods0/*[E0-9]*.tgz",
                      "./*[E0-9]*.tgz",
                    ],
                  },
                  NvFlashFinder: {
                    Enabled: true,
                    Paths: [
                      "./core/nvflash_*",
                      "./core/mods0/nvflash_*",
                      "./core/flash/nvflash_*",
                      "./nvflash_*",
                    ],
                  },
                },
                GlobalVariables: {
                  VBIOS: "xxx.rom",
                  prod: "PG1422",
                  sku: "20",
                  PESG: "PESG.csv",
                  BAT_SPC: "pg142sku20_bat.spc",
                  PCS_SPC: "pg142sku20_pcs.spc",
                  FTA_SPC: "pg142sku20_fta.spc",
                  FTB_SPC: "pg142sku20_ftb.spc",
                  FMT_SPC: "",
                  NDC_SPC: "",
                  DG3_SPC: "pg142sku20_dg3.spc",
                  DG4_SPC: "pg142sku20_dg4.spc",
                },
                PortMap: {
                  PW: {
                    Ports: {
                      0: {
                        Protocol: "pcie",
                        Address: ["17:00.0"],
                        Enabled: "True",
                        Fixture: "Fixture-01",
                      },
                      1: {
                        Protocol: "pcie",
                        Address: "b3:00.0",
                        Enabled: "True",
                        Fixture: "Fixture-02",
                      },
                    },
                    Sequence: ["0", "1"],
                  },
                  X99: {
                    Ports: {
                      0: {
                        Protocol: "pcie",
                        Address: "06:00.0",
                        Enabled: "True",
                        Fixture: "Fixture-01",
                      },
                      1: {
                        Protocol: "pcie",
                        Address: "0a:00.0",
                        Enabled: "True",
                        Fixture: "Fixture-02",
                      },
                    },
                    Sequence: ["0", "1"],
                  },
                  MF51: {
                    Ports: {
                      0: {
                        Protocol: "pcie",
                        Address: "65:00.0",
                        Enabled: "True",
                        Fixture: "Fixture-01",
                      },
                      1: {
                        Protocol: "pcie",
                        Address: ["17:00.0", "b3:00.0"],
                        Enabled: "True",
                        Fixture: "Fixture-02",
                      },
                    },
                    Sequence: ["0", "1"],
                  },
                  Z270A: {
                    Ports: {
                      0: {
                        Protocol: "pcie",
                        Address: "01:00.0",
                        Enabled: "True",
                        Fixture: "Fixture-01",
                      },
                      1: {
                        Protocol: "pcie",
                        Address: "03:00.0",
                        Enabled: "True",
                        Fixture: "Fixture-02",
                      },
                    },
                    Sequence: ["0", "1"],
                  },
                  Z370A: {
                    Ports: {
                      0: {
                        Protocol: "pcie",
                        Address: "01:00.0",
                        Enabled: "True",
                        Fixture: "Fixture-01",
                      },
                    },
                    Sequence: ["0"],
                  },
                  E3991: {
                    Ports: {
                      0: {
                        Protocol: "pcie",
                        Address: "05:00.0",
                        Enabled: "True",
                        Fixture: "Fixture-01",
                      },
                    },
                    Sequence: ["0"],
                  },
                  GEN4: {
                    Ports: {
                      0: {
                        Protocol: "pcie",
                        Address: "08:00.0",
                        Enabled: "True",
                        Fixture: "Fixture-01",
                      },
                      1: {
                        Protocol: "pcie",
                        Address: "09:00.0",
                        Enabled: "True",
                        Fixture: "Fixture-02",
                      },
                    },
                    Sequence: ["0", "1"],
                  },
                  PLATFORM: {
                    Ports: {
                      0: {
                        Protocol: "pcie",
                        Address: [
                          "01:00.0",
                          "02:00.0",
                          "08:00.0",
                          "06:00.0",
                          "09:00.0",
                          "0a:00.0",
                          "17:00.0",
                          "65:00.0",
                          "b6:00.0",
                        ],
                        Enabled: "True",
                        Fixture: "Fixture-01",
                      },
                    },
                    Sequence: ["0"],
                  },
                },
                Stations: {
                  FXSJ_STATION: {
                    "dut-load-trigger": "DeviceLoadedTrigger_InputSerialNumber",
                    "dut-unload-trigger": "DeviceUnloadedTrigger_Silent",
                    "recipe-selector": "RecipeSelector_Local",
                  },
                  READFILE_STATION: {
                    "dut-load-trigger": "DeviceLoadedTrigger_ReadFile",
                    "dut-unload-trigger": "DeviceUnloadedTrigger_Silent",
                    "recipe-selector": "RecipeSelector_Local",
                  },
                  READSN_STATION: {
                    "dut-load-trigger": "DeviceLoadedTrigger_MonitorDevice",
                    "dut-unload-trigger": "DeviceUnloadedTrigger_Silent",
                    "recipe-selector": "RecipeSelector_Local",
                  },
                },
                Equipments: {
                  RecipeSelector_Local: {
                    PG142: {
                      0: {
                        FLA: "./recipes/recipe_fla.xml",
                        BAT: "./recipes/recipe_bat.xml",
                        FCT: "./recipes/recipe_fct.xml",
                        FLB: "./recipes/recipe_flb.xml",
                        FMT: "./recipes/recipe_fmt.xml",
                        DCT: "./recipes/recipe_dct.xml",
                        IOT: "./recipes/recipe_iot.xml",
                        XLT: "./recipes/recipe_xlt.xml",
                        DG3: "./recipes/recipe_dg3.xml",
                        DG4: "./recipes/recipe_dg4.xml",
                      },
                    },
                  },
                  DeviceLoadedTrigger_InputSerialNumber: {
                    InputLabels: "S/N",
                    InputGvHolders: "SN",
                    CheckDeviceConnection: true,
                    CheckDeviceTimeoutInSec: 30,
                  },
                  "DeviceLoadedTrigger_InputSerialNumber:MODS": {
                    InputLabels: "S/N|Bluetooth",
                    InputGvHolders: "SN|BT_MAC",
                    RemoveChars: "-#%|-#%",
                    Length: "0|0",
                    MinLength: "0|0",
                    MaxLength: "0|0",
                    Substring: "0,0|0,0",
                  },
                  DeviceLoadedTrigger_ReadFile: {
                    TargetFile: "{{DIR_CORE}}/mods{{PORT}}/PESG.csv",
                    SearchRegEx: "^BoardSerialNumber,(.*),",
                    rowMatchIndex: 0,
                    columnMatchIndex: 0,
                  },
                  DeviceUnloadedTrigger_Silent: {},
                  DeviceLoadedTrigger_MonitorDevice: {
                    TimeoutInSec: 30,
                  },
                  EntryHandler_Bash: {
                    Program:
                      "{{DIR_SCRIPTS}}/entry_handler.sh {{SN}} {{BT_MAC}} {{ETH_MAC}}",
                    TimeoutInSec: 10,
                  },
                  ExitHandler_Bash: {
                    Program: "{{DIR_SCRIPTS}}/exit_handler.sh",
                    TimeoutInSec: 10,
                  },
                  EntryHandler_Csv: {
                    ProgramList: "{{DIR_SCRIPTS}}/entry_handler.csv",
                  },
                  ExitHandler_Csv: {
                    ProgramList: "{{DIR_SCRIPTS}}/exit_handler.csv",
                  },
                },
                Tools: {
                  Watchdogs: {
                    Enabled: true,
                    Dogs: [
                      {
                        Name: "ModsWatchDog",
                        Enabled: true,
                        Keyword: "** ModsDrvBreakPoint **",
                        MaxAllowedNumOfOccurrence: 40,
                      },
                    ],
                  },
                  Monitors: {
                    Interval: "5s",
                    Enabled: false,
                    LogFile: "event_monitor.log",
                    HardwareMonitors: {
                      Enabled: true,
                      MonitorList: {
                        MemoryMonitor: {
                          Enabled: true,
                        },
                        CpuMonitor: {
                          Enabled: true,
                        },
                        BmcMonitor: {
                          Enabled: true,
                        },
                        StorageMonitor: {
                          Enabled: true,
                        },
                        PcieMonitor: {
                          Enabled: true,
                        },
                      },
                    },
                    SoftwareMonitors: {
                      Enabled: true,
                      MemoryUsageMonitors: [
                        {
                          Name: "ModsMonitor",
                          Enabled: true,
                          ProcessToBeMonitored: "mods",
                        },
                        {
                          Name: "PythonMonitor",
                          Enabled: true,
                          ProcessToBeMonitored: "python3.6",
                        },
                        {
                          Name: "RunnerMonitor",
                          Enabled: true,
                          ProcessToBeMonitored: "run.sh",
                        },
                      ],
                    },
                  },
                },
              },
            },
            FileName: "manifest.json",
          },
          TestsImpacted: [],
        },
        {
          Id: "997184cf-b772-4803-a09d-507acb692294",
          Type: "nvflash",
          Location: "core",
          Descriptor: {
            Version: "5.681.0",
          },
          TestsImpacted: [],
        },
        {
          Id: "96638ae9-4e10-4d74-92c4-7c5bb98fcc54",
          Type: "mods",
          Location: "core",
          Descriptor: {
            Branch: "R455",
            Version: "455.124.1",
          },
          TestsImpacted: [],
        },
        {
          Id: "73bd5a56-18a9-41a0-81ae-b58048775cd2",
          Type: "vbios",
          Location: "core",
          Descriptor: {
            Version: "94.02.5C.00.02",
            FileName: "g133_0500_875__94025C0002.rom",
          },
          TestsImpacted: [],
        },
        {
          Id: "159b8221-d4a8-45d7-944b-bac67ca3153d",
          Type: "runner",
          Location: "",
          Descriptor: {
            Content:
              '#!/bin/bash\n\nPROD=$(grep "prod" ./configs/manifest.json | head -n 1 | awk \'{print $2}\' | sed -e \'s/"//g\' -e \'s/,//g\')\nSKU=$(grep "sku" ./configs/manifest.json | head -n 1 | awk \'{print $2}\' | sed -e \'s/"//g\' -e \'s/,//g\')\n\n# Extract MODS file\ncd ./core/mods0\n\n  i=1\n  for i in $*\n  do\n    PC=${i:2:7}\n\tif [ "$PC" = "process" ]; then\n\t     PROCESS=${i:0-3:3}\n\tfi\n  done\n\n  case $PROCESS in \t\n     *)\n\t     RP=recipe_$(echo $PROCESS | tr \'A-Z\' \'a-z\').xml\n  esac    \t\t \n\n\n\n[[ ! -f "mods" ]] && tar xzf *.tgz\n\ncd ../..\n\nARGS=("$@")\nwhile [[ $# -gt 0 ]]; do\n  case "$1" in \n    --pbr=*)\n      export NAUTILUS_PBR="${1#--pbr=}"\n      ;;\n    --factory=*)\n      export NAUTILUS_FACTORY="${1#--factory=}"\n      ;;\n  esac\n  shift\ndone\n    \nif [ -z ${NAUTILUS_PBR+x} ]; then\n  export NAUTILUS_PBR="PB-DEBUG";\nfi\n\nif [ -z ${NAUTILUS_FACTORY+x} ]; then\n  export NAUTILUS_FACTORY="FXLH" # default factory\nfi\n\nif [ "${NAUTILUS_FACTORY}" = "FXSJ" ]; then\n    mkdir /mnt/mcu -p\n    mount -t cifs -o "user=nobody,vers=1.0" //192.168.2.11/START /mnt/mcu\nfi\n\nif [ "$PROCESS" = "FLB" ] || [ "$PROCESS" = "FLA" ] || [ "$PROCESS" = "BAT" ]; then\n    if [ "$NAUTILUS_FACTORY" = "FXSJ" ] ; then\n    ./nautilus s --station=FXSJ_STATION --logwarehouse=/mnt/mcu/LOGS --pmb=PLATFORM --recipe=./recipes/$RP --process=$PROCESS --port="0" --display=text --allownodevice "${ARGS[@]}"\n    else\n    ./nautilus s --station=READFILE_STATION --logwarehouse=/mnt/mcu/LOGS --pmb=PLATFORM --recipe=./recipes/$RP --process=$PROCESS --port="0" --display=text --allownodevice "${ARGS[@]}"\n    fi\nelse\n./nautilus s --station=READSN_STATION --logwarehouse=/mnt/mcu/LOGS --pmb=PLATFORM --recipe=./recipes/$RP --process=$PROCESS --port="0" --display=text --allownodevice "${ARGS[@]}"\nfi\n\nexit $?\n\n',
            FileName: "run.sh",
          },
          TestsImpacted: [],
        },
        {
          Id: "5788d59d-2bd0-41d1-a951-3f93d8cfec0b",
          Type: "text",
          Location: "core",
          Descriptor: {
            Content: "ldkfjlfkjklfjl",
            FileName: "mytext",
          },
          TestsImpacted: [],
        },
        {
          Id: "4ba2bd78-5dc8-42a7-bfb6-814d7eb6bbc2",
          Type: "text",
          Location: "core",
          Descriptor: {
            Content:
              '2019-03-31 08: 43: 16 ERROR  : Error connecting to the server: definition of service "localservice" not found\r\n\r\nkkljglgjlkj',
            FileName: "pgadmin.log",
          },
          TestsImpacted: [],
        },
      ],
      Tests: [
        {
          Id: "a4fd99b1-2f5b-415d-b57a-bbc260621503",
          Property: {
            Name: "First_TEST_1",
            Group: "CHILFLASH",
            Command: {
              Type: "bash:",
              Content: '#!/bin/bash\necho "Hello"',
            },
            Anchor: "first",
            TestTime: {
              D: 0,
              H: 0,
              M: 2,
              S: 0,
            },
            Timeout: {
              D: 0,
              H: 0,
              M: 4,
              S: 0,
            },
            Loop: 3,
            Retry: 2,
            TestLevel: "continue-on-fail",
            Bypass: true,
            PassFlag: "11",
            FailFlag: "122",
            OnPass: {
              Type: "goto",
              Param: "1",
            },
            OnFail: {},
            Background: true,
            CheckReturnCode: false,
            CollectVars: false,
            ParseReadings: false,
            ParseErrors: true,
            LogsPlaceholder: ["3123213"],
            ClearLogsPlaceholder: true,
            ConcurrentTestmode: {
              Mode: "switched",
              Param: "B1",
            },
            LogParser: {
              Type: "mods",
              Path: "11",
            },
            FailureWeight: 3,
            OnlyFor: {
              Left: "A",
              Compare: "==",
              Right: "A",
            },
          },
          Process: "FLA",
          Bin: null,
        },
        {
          Id: "4ec900cb-f122-4b4b-990c-cb8ef9923e56",
          Property: {
            Name: "NEW_TEST_ITEM_2",
            Group: "",
            Command: {
              Type: "bash:",
              Content: "",
            },
            Anchor: "",
            TestTime: {
              D: 0,
              H: 0,
              M: 0,
              S: 0,
            },
            Timeout: {
              D: 0,
              H: 0,
              M: 0,
              S: 0,
            },
            Loop: 1,
            Retry: 0,
            TestLevel: "stop-on-fail",
            Bypass: false,
            PassFlag: "",
            FailFlag: "",
            OnPass: {
              Type: "none",
              Param: "",
            },
            OnFail: {
              Type: "none",
              Param: "",
            },
            Background: false,
            CheckReturnCode: true,
            CollectVars: true,
            ParseReadings: true,
            ParseErrors: true,
            LogsPlaceholder: [],
            ClearLogsPlaceholder: false,
            ConcurrentTestmode: {
              Mode: "parallel",
              Param: "",
            },
            LogParser: {
              Type: "mods",
              Path: "",
            },
            FailureWeight: 0,
            OnlyFor: {
              Left: "",
              Compare: "==",
              Right: "",
            },
          },
          Process: "FLA",
          Bin: null,
        },
        {
          Id: "6c7f915c-a3c6-4fcf-8015-77195447f1ed",
          Property: {
            Name: "NEW_TEST_ITEM_3",
            Group: "",
            Command: {
              Type: "bash:",
              Content: "",
            },
            Anchor: "",
            TestTime: {
              D: 0,
              H: 0,
              M: 0,
              S: 0,
            },
            Timeout: {
              D: 0,
              H: 0,
              M: 0,
              S: 0,
            },
            Loop: 1,
            Retry: 0,
            TestLevel: "stop-on-fail",
            Bypass: false,
            PassFlag: "",
            FailFlag: "",
            OnPass: {
              Type: "none",
              Param: "",
            },
            OnFail: {
              Type: "none",
              Param: "",
            },
            Background: false,
            CheckReturnCode: true,
            CollectVars: true,
            ParseReadings: true,
            ParseErrors: true,
            LogsPlaceholder: [],
            ClearLogsPlaceholder: false,
            ConcurrentTestmode: {
              Mode: "parallel",
              Param: "",
            },
            LogParser: {
              Type: "mods",
              Path: "",
            },
            FailureWeight: 0,
            OnlyFor: {
              Left: "",
              Compare: "==",
              Right: "",
            },
          },
          Process: "FLA",
          Bin: null,
        },
        {
          Id: "8d5a588b-26a3-4d03-ab70-3f5ad332e488",
          Property: {
            Name: "NEW_TEST_ITEM_4",
            Group: "",
            Command: {
              Type: "bash:",
              Content: "",
            },
            Anchor: "",
            TestTime: {
              D: 0,
              H: 0,
              M: 0,
              S: 0,
            },
            Timeout: {
              D: 0,
              H: 0,
              M: 0,
              S: 0,
            },
            Loop: 1,
            Retry: 0,
            TestLevel: "stop-on-fail",
            Bypass: false,
            PassFlag: "",
            FailFlag: "",
            OnPass: {
              Type: "none",
              Param: "",
            },
            OnFail: {
              Type: "none",
              Param: "",
            },
            Background: false,
            CheckReturnCode: true,
            CollectVars: true,
            ParseReadings: true,
            ParseErrors: true,
            LogsPlaceholder: [],
            ClearLogsPlaceholder: false,
            ConcurrentTestmode: {
              Mode: "parallel",
              Param: "",
            },
            LogParser: {
              Type: "mods",
              Path: "",
            },
            FailureWeight: 0,
            OnlyFor: {
              Left: "",
              Compare: "==",
              Right: "",
            },
          },
          Process: "FLA",
          Bin: null,
        },
        {
          Id: "6cbe5ffe-5d92-46dc-8d4e-51f5cedc7275",
          Property: {
            Name: "NEW_TEST_ITEM_5",
            Group: "",
            Command: {
              Type: "bash:",
              Content: "",
            },
            Anchor: "",
            TestTime: {
              D: 0,
              H: 0,
              M: 0,
              S: 0,
            },
            Timeout: {
              D: 0,
              H: 0,
              M: 0,
              S: 0,
            },
            Loop: 1,
            Retry: 0,
            TestLevel: "stop-on-fail",
            Bypass: false,
            PassFlag: "",
            FailFlag: "",
            OnPass: {
              Type: "none",
              Param: "",
            },
            OnFail: {
              Type: "none",
              Param: "",
            },
            Background: false,
            CheckReturnCode: true,
            CollectVars: true,
            ParseReadings: true,
            ParseErrors: true,
            LogsPlaceholder: [],
            ClearLogsPlaceholder: false,
            ConcurrentTestmode: {
              Mode: "parallel",
              Param: "",
            },
            LogParser: {
              Type: "mods",
              Path: "",
            },
            FailureWeight: 0,
            OnlyFor: {
              Left: "",
              Compare: "==",
              Right: "",
            },
          },
          Process: "FLA",
          Bin: null,
        },
        {
          Id: "293fb6c9-e401-45d6-a8c4-fe25d49da0f3",
          Property: {
            Name: "NEW_TEST_ITEM_6",
            Group: "",
            Command: {
              Type: "bash:",
              Content:
                'hello\r\n\r\nARGS=("$@")\r\nwhile [[ $# -gt 0 ]]; do\r\n  case "$1" in \r\n    --pbr=*)\r\n      export NAUTILUS_PBR="${1#--pbr=}"\r\n      ;;\r\n    --factory=*)\r\n      export NAUTILUS_FACTORY="${1#--factory=}"\r\n      ;;\r\n  esac\r\n  shift\r\ndone\r\n',
            },
            Anchor: "",
            TestTime: {
              D: 0,
              H: 0,
              M: 0,
              S: 0,
            },
            Timeout: {
              D: 0,
              H: 0,
              M: 0,
              S: 0,
            },
            Loop: 1,
            Retry: 0,
            TestLevel: "stop-on-fail",
            Bypass: false,
            PassFlag: "",
            FailFlag: "",
            OnPass: {
              Type: "none",
              Param: "",
            },
            OnFail: {
              Type: "none",
              Param: "",
            },
            Background: false,
            CheckReturnCode: true,
            CollectVars: true,
            ParseReadings: true,
            ParseErrors: true,
            LogsPlaceholder: [],
            ClearLogsPlaceholder: false,
            ConcurrentTestmode: {
              Mode: "parallel",
              Param: "",
            },
            LogParser: {
              Type: "mods",
              Path: "",
            },
            FailureWeight: 0,
            OnlyFor: {
              Left: "",
              Compare: "==",
              Right: "",
            },
          },
          Process: "BAT",
          Bin: null,
        },
        {
          Id: "6e2d0d38-5c79-4790-aeda-65b0bf277f7a",
          Property: {
            Name: "Last_TEST",
            Group: "CHECK_LED_BLUE",
            Command: {
              Type: "bash:",
              Content: '#!/bin/bash\necho "Hello"',
            },
            Anchor: "first",
            TestTime: {
              D: 0,
              H: 0,
              M: 2,
              S: 0,
            },
            Timeout: {
              D: 0,
              H: 0,
              M: 4,
              S: 0,
            },
            Loop: 3,
            Retry: 2,
            TestLevel: "continue-on-fail",
            Bypass: true,
            PassFlag: "11",
            FailFlag: "122",
            OnPass: {
              Type: "goto",
              Param: "0",
            },
            OnFail: {},
            Background: true,
            CheckReturnCode: false,
            CollectVars: false,
            ParseReadings: false,
            ParseErrors: true,
            LogsPlaceholder: ["3123213"],
            ClearLogsPlaceholder: true,
            ConcurrentTestmode: {
              Mode: "switched",
              Param: "B1",
            },
            LogParser: {
              Type: "mods",
              Path: "11",
            },
            FailureWeight: 3,
            OnlyFor: {
              Left: "A",
              Compare: "==",
              Right: "A",
            },
          },
          Process: "FCT",
          Bin: null,
        },
      ],
      ProcessFlow: ["FLA", "BAT", "FCT"],
};
