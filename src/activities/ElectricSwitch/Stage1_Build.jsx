import React from 'react';
import AssemblyFramework from './AssemblyFramework';
import { 
  CardboardSVG, 
  DrawingPinSVG, 
  SafetyPinSVG, 
  BulbSVG, 
  BatterySVG, 
  WiresSVG 
} from './CircuitElements';

const STEPS = [
  {
    id: 'cardboard',
    name: 'Cardboard Base',
    desc: 'Acts as an insulating platform to build the switch on.',
    hint: 'First, we need the cardboard base to mount our switch.',
    prereq: [],
    targetPos: { x: 370, y: 200, width: 160, height: 210 },
    renderWorkspace: (placed) => placed.cardboard && <CardboardSVG />,
    renderInventoryIcon: () => (
      <svg viewBox="360 190 180 230" width="24" height="24" style={{ pointerEvents: 'none' }}>
        <CardboardSVG />
      </svg>
    ),
    renderPartsBenchIcon: () => (
      <svg viewBox="360 190 180 230" width="24" height="24" style={{ pointerEvents: 'none' }}>
        <CardboardSVG />
      </svg>
    ),
  },
  {
    id: 'pin1',
    name: 'First Drawing Pin',
    desc: 'Serves as the pivot point/anchor for the safety pin.',
    hint: 'Place the first drawing pin into the cardboard base.',
    prereq: ['cardboard'],
    targetPos: { x: 434, y: 234, width: 32, height: 32 },
    renderWorkspace: (placed) => placed.pin1 && (
      <DrawingPinSVG x={450} y={250} label="Drawing Pin 1" isPlaced={true} />
    ),
    renderInventoryIcon: () => (
      <svg viewBox="430 230 40 40" width="24" height="24" style={{ pointerEvents: 'none' }}>
        <DrawingPinSVG x={450} y={250} isPlaced={true} />
      </svg>
    ),
    renderPartsBenchIcon: () => (
      <svg viewBox="430 230 40 40" width="24" height="24" style={{ pointerEvents: 'none' }}>
        <DrawingPinSVG x={450} y={250} isPlaced={true} />
      </svg>
    ),
  },
  {
    id: 'safetyPin',
    name: 'Safety Pin',
    desc: 'The movable conductor that will close or open the gap.',
    hint: 'Attach the safety pin to the first drawing pin.',
    prereq: ['cardboard', 'pin1'],
    errorMsg: '❌ Safety pin cannot rotate or stay in place without a drawing pin anchor! Place the first drawing pin first.',
    targetPos: { x: 380, y: 240, width: 80, height: 120 },
    renderWorkspace: (placed) => placed.safetyPin && (
      <SafetyPinSVG x={450} y={250} rotation={-35} isPlaced={true} />
    ),
    renderInventoryIcon: () => (
      <svg viewBox="-20 -20 40 150" width="24" height="24" style={{ pointerEvents: 'none' }}>
        <SafetyPinSVG x={0} y={0} rotation={0} isPlaced={true} />
      </svg>
    ),
    renderPartsBenchIcon: () => (
      <svg viewBox="-20 -20 40 150" width="24" height="24" style={{ pointerEvents: 'none' }}>
        <SafetyPinSVG x={0} y={0} rotation={0} isPlaced={true} />
      </svg>
    ),
  },
  {
    id: 'pin2',
    name: 'Second Drawing Pin',
    desc: 'The contact terminal that the safety pin will touch to close the circuit.',
    hint: 'Fix the second drawing pin so the safety pin can touch it.',
    prereq: ['cardboard', 'safetyPin'],
    targetPos: { x: 434, y: 354, width: 32, height: 32 },
    renderWorkspace: (placed) => placed.pin2 && (
      <DrawingPinSVG x={450} y={370} label="Drawing Pin 2" isPlaced={true} />
    ),
    renderInventoryIcon: () => (
      <svg viewBox="430 350 40 40" width="24" height="24" style={{ pointerEvents: 'none' }}>
        <DrawingPinSVG x={450} y={370} isPlaced={true} />
      </svg>
    ),
    renderPartsBenchIcon: () => (
      <svg viewBox="430 350 40 40" width="24" height="24" style={{ pointerEvents: 'none' }}>
        <DrawingPinSVG x={450} y={370} isPlaced={true} />
      </svg>
    ),
  },
  {
    id: 'battery',
    name: 'Electric Cell (Battery)',
    desc: 'The source of electrical energy for the circuit.',
    hint: 'Place the 1.5V electric cell on the board.',
    prereq: ['cardboard'],
    targetPos: { x: 104, y: 366, width: 92, height: 48 },
    renderWorkspace: (placed) => placed.battery && (
      <BatterySVG isPlaced={true} />
    ),
    renderInventoryIcon: () => (
      <svg viewBox="100 365 100 50" width="24" height="24" style={{ pointerEvents: 'none' }}>
        <BatterySVG isPlaced={true} />
      </svg>
    ),
    renderPartsBenchIcon: () => (
      <svg viewBox="100 365 100 50" width="24" height="24" style={{ pointerEvents: 'none' }}>
        <BatterySVG isPlaced={true} />
      </svg>
    ),
  },
  {
    id: 'bulb',
    name: 'Electric Bulb',
    desc: 'The load/device that will indicate if current is flowing.',
    hint: 'Install the bulb holder and bulb.',
    prereq: ['cardboard'],
    targetPos: { x: 256, y: 23, width: 88, height: 97 },
    renderWorkspace: (placed) => placed.bulb && (
      <BulbSVG isPlaced={true} isOn={false} />
    ),
    renderInventoryIcon: () => (
      <svg viewBox="250 20 100 100" width="24" height="24" style={{ pointerEvents: 'none' }}>
        <BulbSVG isPlaced={true} />
      </svg>
    ),
    renderPartsBenchIcon: () => (
      <svg viewBox="250 20 100 100" width="24" height="24" style={{ pointerEvents: 'none' }}>
        <BulbSVG isPlaced={true} />
      </svg>
    ),
  },
  {
    id: 'wires',
    name: 'Connecting Wires',
    desc: 'Provide a path for electric current to flow through.',
    hint: 'Connect the wires to link the battery, bulb, and switch.',
    prereq: ['cardboard', 'pin1', 'pin2', 'battery', 'bulb'],
    errorMsg: '❌ Wires need terminals (pins, battery, bulb) to connect! Place all other components first.',
    targetPos: { x: 200, y: 150, width: 200, height: 150 },
    renderWorkspace: (placed) => placed.wires && (
      <WiresSVG 
        isWireConnected={true} 
        isBatteryPresent={placed.battery}
        isBulbPresent={placed.bulb}
        arePinsPlaced={placed.pin1 && placed.pin2}
        isCurrentFlowing={false}
      />
    ),
    renderInventoryIcon: () => (
      <svg viewBox="100 100 350 330" width="24" height="24" style={{ pointerEvents: 'none' }}>
        <WiresSVG isWireConnected={true} isBatteryPresent={true} isBulbPresent={true} arePinsPlaced={true} />
      </svg>
    ),
    renderPartsBenchIcon: () => (
      <svg viewBox="100 100 350 330" width="24" height="24" style={{ pointerEvents: 'none' }}>
        <WiresSVG isWireConnected={true} isBatteryPresent={true} isBulbPresent={true} arePinsPlaced={true} />
      </svg>
    ),
  }
];

export default function Stage1_Build({ onComplete }) {
  return (
    <AssemblyFramework
      steps={STEPS}
      onComplete={onComplete}
      title="Construct the Switch"
      subjectBadge="Stage 1: Build the Switch"
    />
  );
}
