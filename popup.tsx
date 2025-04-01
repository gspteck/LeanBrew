import { useState, useEffect } from "react"
import { Storage } from "@plasmohq/storage"

import "./popup.css"

import LogoImage from "./assets/icon.png"
import OneLinerImage from "./assets/oneliner.png"
import OldPostsImage from "./assets/oldposts.png"
import TermImage from "./assets/term.png"

const storage = new Storage()

export default function Popup() {
	const [oneLinerFilterEnabled, setOneLinerFilterEnabled] = useState<boolean>(false)  //  For one-liner posts removal.
  const [aiFilterEnabled, setAiFilterEnabled] = useState<boolean>(false)  //  For AI replies removal.
  const [adFilterEnabled, setAdFilterEnabled] = useState<boolean>(false)  //  For AD removal.
	const [oldPostFilterEnabled, setOldPostFilterEnabled] = useState<boolean>(false)  //  For old post removal.
	const [termFilterEnabled, setTermFilterEnabled] = useState<boolean>(false)  //  For posts with specific term removal.

  useEffect(() => {
    //  Load the filter state for one-liner posts.
    storage.get("oneLinerFilterEnabled").then((value) => {
      if (typeof value === "boolean") {
        setOneLinerFilterEnabled(value)
      } else {
        setOneLinerFilterEnabled(false)
			}
    })

    //  Load the filter state for AI replies.
    storage.get("aiFilterEnabled").then((value) => {
      if (typeof value === "boolean") {
        setAiFilterEnabled(value)
      } else {
        setAiFilterEnabled(false)
			}
    })

		//  Load the filter state for ADs.
    storage.get("adFilterEnabled").then((value) => {
      if (typeof value === "boolean") {
        setAdFilterEnabled(value)
      } else {
        setAdFilterEnabled(false)
			}
    })

		//  Load the filter state for old posts.
    storage.get("oldPostFilterEnabled").then((value) => {
      if (typeof value === "boolean") {
        setOldPostFilterEnabled(value)
      } else {
        setOldPostFilterEnabled(false)
			}
    })

		//  Load the filter state for posts with specific terms.
    storage.get("termFilterEnabled").then((value) => {
      if (typeof value === "boolean") {
        setTermFilterEnabled(value)
      } else {
        setTermFilterEnabled(false)
			}
    })
  }, [])

  const handleOneLinerToggle = async () => {
		//  Handle one-liner posts toggle.
    setOneLinerFilterEnabled(!oneLinerFilterEnabled)
    await storage.set("oneLinerFilterEnabled", !oneLinerFilterEnabled)
	}

	const handleAiToggle = async () => {
		//  Handle AI replies toggle.
		setAiFilterEnabled(!aiFilterEnabled)
    await storage.set("aiFilterEnabled", !aiFilterEnabled)
	}

	const handleAdToggle = async () => {
		//  Handle ADs toggle.
		setAdFilterEnabled(!adFilterEnabled)
    await storage.set("adFilterEnabled", !adFilterEnabled)
	}

	const handleOldPostToggle = async () => {
		//  Handle old posts toggle.
		setOldPostFilterEnabled(!oldPostFilterEnabled)
    await storage.set("oldPostFilterEnabled", !oldPostFilterEnabled)
	}
		
	const handleTermToggle = async () => {
		//  Handle posts with specific term toggle.
		setTermFilterEnabled(!termFilterEnabled)
    await storage.set("termFilterEnabled", !termFilterEnabled)
  } 

  return (
    <div style={{ width:"400px", marginBottom:"30px" }}>
			{ /*  Top Title  */ }
			<ul style={{ listStyle:"none", padding:0, margin:0 }}>
				<li style={{ display:"inline-block" }}>
					<h2
						style={{
							margin:"30px 20px 15px 15px",
							fontSize:"30px",
							fontWeight:"600",
						}}
					>
						<img src={ LogoImage } style= {{ width:"20px", marginRight:"5px" }}/>LeanBrew
					</h2>
				</li>
				<li style={{ display:"inline-block" }}>
					<h4>created by <a href="https://x.com/giosaia" target="_blank" style={{ color:"#36454F", textDecoration:"none" }}>GSPTeck</a></h4>
				</li>
			</ul>

			{ /*  Top Container  */ }
			<div style={{
				display:"flex",
				justifyContent:"center",
				alignItems:"center",
				margin:"10px 10px 20px 10px",
				padding:"20px",
				background:"linear-gradient(145deg, #e6e6e6, #ffffff)",
				borderRadius:"25px",
        boxShadow:"5px 5px 15px #bcbcbc, -5px -5px 15px #ffffff",
			}}>
				<ul style={{ display:"flex", listStyle:"none", padding:0, margin:0, gap:"5vw" }}>
					<li style={{ display:"flex" }}>
						{ /*  Single Line Post Removal  */ }
						<div style={{
							width:"100px",
							display:"flex",
							flexDirection:"column",
            	justifyContent:"center",
            	alignItems:"center",
						}}>
							<div style={{
  							boxShadow:"inset 0 0 5px rgba(0, 0, 0, 0.5)",
  							borderRadius:"20px",
  							width:"100px",
								height:"100px",
								overflow:"hidden",
								display:"flex",
								justifyContent:"center",
								alignItems:"center",
								backgroundColor:"rgba(0, 0, 0, 0.03)",
								marginBottom:"5px",
							}}>
								<img
									src={ OneLinerImage }
									style={{
										width:"80px",
										borderRadius:"20px",
										display:"block",
									}}
								/>
							</div>
							<input
								type="checkbox"
								checked={ oneLinerFilterEnabled }
								onChange={ handleOneLinerToggle }
								style={{
									accentColor:"#36454F",
									width:"16px",
									height:"16px",
									cursor:"pointer",
								}}
							/>
						</div>
					</li>
					<li style={{ display:"flex" }}>
						{ /*  Old Post Removal  */ }
						<div style={{
							width:"100px",
							display:"flex",
							flexDirection:"column",
            	justifyContent:"center",
            	alignItems:"center",
						}}>
							<div style={{
  							boxShadow:"inset 0 0 5px rgba(0, 0, 0, 0.5)",
  							borderRadius:"20px",
  							width:"100px",
								height:"100px",
								overflow:"hidden",
								display:"flex",
								justifyContent:"center",
								alignItems:"center",
								backgroundColor:"rgba(0, 0, 0, 0.03)",
								marginBottom:"5px",
							}}>
								<img
									src={ OldPostsImage }
									style={{
										width:"80px",
										borderRadius:"20px",
										display:"block",
									}}
								/>
							</div>
							<input
								type="checkbox"
								checked={ oldPostFilterEnabled }
								onChange={ handleOldPostToggle }
								style={{
									accentColor:"#36454F",
									width:"16px",
									height:"16px",
									cursor:"pointer",
								}}
							/>
						</div>
					</li>
					<li style={{ display:"flex" }}>
						{ /*  Specific Term Removal  */ }
						<div style={{
							width:"100px",
							display:"flex",
							flexDirection:"column",
            	justifyContent:"center",
            	alignItems:"center",
						}}>
							<div style={{
  							boxShadow:"inset 0 0 5px rgba(0, 0, 0, 0.5)",
  							borderRadius:"20px",
  							width:"100px",
								height:"100px",
								overflow:"hidden",
								display:"flex",
								justifyContent:"center",
								alignItems:"center",
								backgroundColor:"rgba(0, 0, 0, 0.03)",
								marginBottom:"5px",
							}}>
								<img
									src={ TermImage }
									style={{
										width:"80px",
										borderRadius:"20px",
										display:"block",
									}}
								/>
							</div>
							<input
								type="checkbox"
								checked={ termFilterEnabled }
								//onChange={ handleTermToggle }
								style={{
									accentColor:"#36454F",
									width:"16px",
									height:"16px",
									cursor:"not-allowed",
								}}
							/>
						</div>
					</li>
				</ul>
			</div>

			{ /*  Bottom Container  */ }	
		</div>
	)
}
