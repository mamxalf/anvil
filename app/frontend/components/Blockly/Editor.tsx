import React from 'react'
import { BlocklyWorkspace } from 'react-blockly'
import * as Blockly from 'blockly/core'
import { toolbox } from './Toolbox'
import { defineCustomBlocks } from './CustomBlocks'
import { configureGenerator } from './Generator'
import { javascriptGenerator } from 'blockly/javascript'

// Initialize custom blocks and generator
defineCustomBlocks()
configureGenerator()

interface BlocklyEditorProps {
  initialXml?: string
  onCodeChange: (code: string) => void
  onXmlChange?: (xml: string) => void
}

const BlocklyEditor: React.FC<BlocklyEditorProps> = ({ initialXml, onCodeChange, onXmlChange }) => {
  const workspaceConfiguration = {
    grid: {
      spacing: 20,
      length: 3,
      colour: '#ccc',
      snap: true,
    },
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1.0,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2,
      pinch: true,
    },
    trashcan: true,
  }

  const handleWorkspaceChange = (workspace: Blockly.WorkspaceSvg) => {
    const code = javascriptGenerator.workspaceToCode(workspace)
    onCodeChange(code)

    if (onXmlChange) {
      const xml = Blockly.Xml.workspaceToDom(workspace)
      const xmlText = Blockly.Xml.domToText(xml)
      onXmlChange(xmlText)
    }
  }

  return (
    <div className="w-full h-full min-h-[500px] border border-gray-200 rounded-lg overflow-hidden">
      <BlocklyWorkspace
        className="w-full h-full"
        toolboxConfiguration={toolbox}
        workspaceConfiguration={workspaceConfiguration}
        initialXml={initialXml}
        onWorkspaceChange={handleWorkspaceChange}
      />
    </div>
  )
}

export default BlocklyEditor
