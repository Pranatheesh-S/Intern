import{c as ye,r as h,j as e,R as K,a as W,A as V,b as De}from"./index-CGaOyH1X.js";import{I as Me,F as le,c as X,d as T,W as Ae,B as ee,S as ve,V as E,e as _e,U as ce,f as de,g as be,M as ke,h as U,L as Ie,i as Re,j as I,k as Te,a as Be,_ as J,l as Ue,u as Pe,C as H,O as F}from"./OrbitControls-Bl_AlS-W.js";import{H as Oe}from"./Html-QERVegM3.js";import{I as je}from"./info-lHDBNeu4.js";import{Z as te,a as ie}from"./zoom-in-Bg_dHYyJ.js";import{v as we,E as se,C as ne}from"./ContactShadows-ahejzuad.js";import{m as re}from"./proxy-1FqKjn5J.js";import{P as Ne}from"./power-DhLtRK0v.js";import{L as Ge}from"./lightbulb-xYZZfB4f.js";import{T as pe}from"./Text-E503eXBy.js";import{T as We}from"./triangle-alert-_V0g_bx3.js";import{C as B}from"./circle-check-DLUme8X5.js";import{R as He}from"./refresh-ccw-AFHUdSQN.js";import{C as Fe}from"./circle-x-D37MgZaS.js";import{A as Ve}from"./index-ljtBiWSp.js";import"./index-Ca2whQl_.js";/**
 * @license lucide-react v1.21.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qe=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"m21 3-7 7",key:"1l2asr"}],["path",{d:"m3 21 7-7",key:"tjx5ai"}],["path",{d:"M9 21H3v-6",key:"wtvkvv"}]],fe=ye("maximize-2",qe);/**
 * @license lucide-react v1.21.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qe=[["path",{d:"m14 10 7-7",key:"oa77jy"}],["path",{d:"M20 10h-6V4",key:"mjg0md"}],["path",{d:"m3 21 7-7",key:"tjx5ai"}],["path",{d:"M4 14h6v6",key:"rmj7iw"}]],Ze=ye("minimize-2",Qe),Se=we>=125?"uv1":"uv2",ue=new ee,O=new E;class oe extends Me{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const t=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],i=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new le(t,3)),this.setAttribute("uv",new le(i,2))}applyMatrix4(t){const i=this.attributes.instanceStart,n=this.attributes.instanceEnd;return i!==void 0&&(i.applyMatrix4(t),n.applyMatrix4(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(t){let i;t instanceof Float32Array?i=t:Array.isArray(t)&&(i=new Float32Array(t));const n=new X(i,6,1);return this.setAttribute("instanceStart",new T(n,3,0)),this.setAttribute("instanceEnd",new T(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(t,i=3){let n;t instanceof Float32Array?n=t:Array.isArray(t)&&(n=new Float32Array(t));const r=new X(n,i*2,1);return this.setAttribute("instanceColorStart",new T(r,i,0)),this.setAttribute("instanceColorEnd",new T(r,i,i)),this}fromWireframeGeometry(t){return this.setPositions(t.attributes.position.array),this}fromEdgesGeometry(t){return this.setPositions(t.attributes.position.array),this}fromMesh(t){return this.fromWireframeGeometry(new Ae(t.geometry)),this}fromLineSegments(t){const i=t.geometry;return this.setPositions(i.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ee);const t=this.attributes.instanceStart,i=this.attributes.instanceEnd;t!==void 0&&i!==void 0&&(this.boundingBox.setFromBufferAttribute(t),ue.setFromBufferAttribute(i),this.boundingBox.union(ue))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ve),this.boundingBox===null&&this.computeBoundingBox();const t=this.attributes.instanceStart,i=this.attributes.instanceEnd;if(t!==void 0&&i!==void 0){const n=this.boundingSphere.center;this.boundingBox.getCenter(n);let r=0;for(let s=0,c=t.count;s<c;s++)O.fromBufferAttribute(t,s),r=Math.max(r,n.distanceToSquared(O)),O.fromBufferAttribute(i,s),r=Math.max(r,n.distanceToSquared(O));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(t){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(t)}}class ze extends oe{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(t){const i=t.length-3,n=new Float32Array(2*i);for(let r=0;r<i;r+=3)n[2*r]=t[r],n[2*r+1]=t[r+1],n[2*r+2]=t[r+2],n[2*r+3]=t[r+3],n[2*r+4]=t[r+4],n[2*r+5]=t[r+5];return super.setPositions(n),this}setColors(t,i=3){const n=t.length-i,r=new Float32Array(2*n);if(i===3)for(let s=0;s<n;s+=i)r[2*s]=t[s],r[2*s+1]=t[s+1],r[2*s+2]=t[s+2],r[2*s+3]=t[s+3],r[2*s+4]=t[s+4],r[2*s+5]=t[s+5];else for(let s=0;s<n;s+=i)r[2*s]=t[s],r[2*s+1]=t[s+1],r[2*s+2]=t[s+2],r[2*s+3]=t[s+3],r[2*s+4]=t[s+4],r[2*s+5]=t[s+5],r[2*s+6]=t[s+6],r[2*s+7]=t[s+7];return super.setColors(r,i),this}fromLine(t){const i=t.geometry;return this.setPositions(i.attributes.position.array),this}}class ae extends _e{constructor(t){super({type:"LineMaterial",uniforms:ce.clone(ce.merge([de.common,de.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new be(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${we>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(i){this.uniforms.diffuse.value=i}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(i){i===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(i){this.uniforms.linewidth.value=i}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(i){!!i!="USE_DASH"in this.defines&&(this.needsUpdate=!0),i===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(i){this.uniforms.dashScale.value=i}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(i){this.uniforms.dashSize.value=i}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(i){this.uniforms.dashOffset.value=i}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(i){this.uniforms.gapSize.value=i}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(i){this.uniforms.opacity.value=i}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(i){this.uniforms.resolution.value.copy(i)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(i){!!i!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),i===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(t)}}const q=new U,me=new E,he=new E,z=new U,C=new U,M=new U,Q=new E,Z=new Re,L=new Ie,xe=new E,N=new ee,G=new ve,A=new U;let _,R;function ge(m,t,i){return A.set(0,0,-t,1).applyMatrix4(m.projectionMatrix),A.multiplyScalar(1/A.w),A.x=R/i.width,A.y=R/i.height,A.applyMatrix4(m.projectionMatrixInverse),A.multiplyScalar(1/A.w),Math.abs(Math.max(A.x,A.y))}function $e(m,t){const i=m.matrixWorld,n=m.geometry,r=n.attributes.instanceStart,s=n.attributes.instanceEnd,c=Math.min(n.instanceCount,r.count);for(let o=0,a=c;o<a;o++){L.start.fromBufferAttribute(r,o),L.end.fromBufferAttribute(s,o),L.applyMatrix4(i);const d=new E,l=new E;_.distanceSqToSegment(L.start,L.end,l,d),l.distanceTo(d)<R*.5&&t.push({point:l,pointOnLine:d,distance:_.origin.distanceTo(l),object:m,face:null,faceIndex:o,uv:null,[Se]:null})}}function Ye(m,t,i){const n=t.projectionMatrix,s=m.material.resolution,c=m.matrixWorld,o=m.geometry,a=o.attributes.instanceStart,d=o.attributes.instanceEnd,l=Math.min(o.instanceCount,a.count),u=-t.near;_.at(1,M),M.w=1,M.applyMatrix4(t.matrixWorldInverse),M.applyMatrix4(n),M.multiplyScalar(1/M.w),M.x*=s.x/2,M.y*=s.y/2,M.z=0,Q.copy(M),Z.multiplyMatrices(t.matrixWorldInverse,c);for(let p=0,x=l;p<x;p++){if(z.fromBufferAttribute(a,p),C.fromBufferAttribute(d,p),z.w=1,C.w=1,z.applyMatrix4(Z),C.applyMatrix4(Z),z.z>u&&C.z>u)continue;if(z.z>u){const f=z.z-C.z,b=(z.z-u)/f;z.lerp(C,b)}else if(C.z>u){const f=C.z-z.z,b=(C.z-u)/f;C.lerp(z,b)}z.applyMatrix4(n),C.applyMatrix4(n),z.multiplyScalar(1/z.w),C.multiplyScalar(1/C.w),z.x*=s.x/2,z.y*=s.y/2,C.x*=s.x/2,C.y*=s.y/2,L.start.copy(z),L.start.z=0,L.end.copy(C),L.end.z=0;const v=L.closestPointToPointParameter(Q,!0);L.at(v,xe);const y=I.lerp(z.z,C.z,v),j=y>=-1&&y<=1,S=Q.distanceTo(xe)<R*.5;if(j&&S){L.start.fromBufferAttribute(a,p),L.end.fromBufferAttribute(d,p),L.start.applyMatrix4(c),L.end.applyMatrix4(c);const f=new E,b=new E;_.distanceSqToSegment(L.start,L.end,b,f),i.push({point:b,pointOnLine:f,distance:_.origin.distanceTo(b),object:m,face:null,faceIndex:p,uv:null,[Se]:null})}}}class Ce extends ke{constructor(t=new oe,i=new ae({color:Math.random()*16777215})){super(t,i),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const t=this.geometry,i=t.attributes.instanceStart,n=t.attributes.instanceEnd,r=new Float32Array(2*i.count);for(let c=0,o=0,a=i.count;c<a;c++,o+=2)me.fromBufferAttribute(i,c),he.fromBufferAttribute(n,c),r[o]=o===0?0:r[o-1],r[o+1]=r[o]+me.distanceTo(he);const s=new X(r,2,1);return t.setAttribute("instanceDistanceStart",new T(s,1,0)),t.setAttribute("instanceDistanceEnd",new T(s,1,1)),this}raycast(t,i){const n=this.material.worldUnits,r=t.camera;r===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const s=t.params.Line2!==void 0&&t.params.Line2.threshold||0;_=t.ray;const c=this.matrixWorld,o=this.geometry,a=this.material;R=a.linewidth+s,o.boundingSphere===null&&o.computeBoundingSphere(),G.copy(o.boundingSphere).applyMatrix4(c);let d;if(n)d=R*.5;else{const u=Math.max(r.near,G.distanceToPoint(_.origin));d=ge(r,u,a.resolution)}if(G.radius+=d,_.intersectsSphere(G)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),N.copy(o.boundingBox).applyMatrix4(c);let l;if(n)l=R*.5;else{const u=Math.max(r.near,N.distanceToPoint(_.origin));l=ge(r,u,a.resolution)}N.expandByScalar(l),_.intersectsBox(N)!==!1&&(n?$e(this,i):Ye(this,r,i))}onBeforeRender(t){const i=this.material.uniforms;i&&i.resolution&&(t.getViewport(q),this.material.uniforms.resolution.value.set(q.z,q.w))}}class Xe extends Ce{constructor(t=new ze,i=new ae({color:Math.random()*16777215})){super(t,i),this.isLine2=!0,this.type="Line2"}}const Je=h.forwardRef(function({points:t,color:i=16777215,vertexColors:n,linewidth:r,lineWidth:s,segments:c,dashed:o,...a},d){var l,u;const p=Te(j=>j.size),x=h.useMemo(()=>c?new Ce:new Xe,[c]),[g]=h.useState(()=>new ae),v=(n==null||(l=n[0])==null?void 0:l.length)===4?4:3,y=h.useMemo(()=>{const j=c?new oe:new ze,S=t.map(f=>{const b=Array.isArray(f);return f instanceof E||f instanceof U?[f.x,f.y,f.z]:f instanceof be?[f.x,f.y,0]:b&&f.length===3?[f[0],f[1],f[2]]:b&&f.length===2?[f[0],f[1],0]:f});if(j.setPositions(S.flat()),n){i=16777215;const f=n.map(b=>b instanceof Be?b.toArray():b);j.setColors(f.flat(),v)}return j},[t,c,n,v]);return h.useLayoutEffect(()=>{x.computeLineDistances()},[t,x]),h.useLayoutEffect(()=>{o?g.defines.USE_DASH="":delete g.defines.USE_DASH,g.needsUpdate=!0},[o,g]),h.useEffect(()=>()=>{y.dispose(),g.dispose()},[y]),h.createElement("primitive",J({object:x,ref:d},a),h.createElement("primitive",{object:y,attach:"geometry"}),h.createElement("primitive",J({object:g,attach:"material",color:i,vertexColors:!!n,resolution:[p.width,p.height],linewidth:(u=r??s)!==null&&u!==void 0?u:1,dashed:o,transparent:v===4},a)))}),Ke=new E,$=h.forwardRef(function({start:t=[0,0,0],end:i=[0,0,0],mid:n,segments:r=20,...s},c){const o=h.useRef(null);h.useImperativeHandle(c,()=>o.current);const[a]=h.useState(()=>new Ue(void 0,void 0,void 0)),d=h.useCallback((u,p,x,g=20)=>(u instanceof E?a.v0.copy(u):a.v0.set(...u),p instanceof E?a.v2.copy(p):a.v2.set(...p),x instanceof E?a.v1.copy(x):Array.isArray(x)?a.v1.set(...x):a.v1.copy(a.v0.clone().add(a.v2.clone().sub(a.v0)).add(Ke.set(0,a.v0.y-a.v2.y,0))),a.getPoints(g)),[]);h.useLayoutEffect(()=>{o.current.setPoints=(u,p,x)=>{const g=d(u,p,x);o.current.geometry&&o.current.geometry.setPositions(g.map(v=>v.toArray()).flat())}},[]);const l=h.useMemo(()=>d(t,i,n,r),[t,i,n,r]);return h.createElement(Je,J({ref:o,points:l},s))});function P({exploded:m,onPartSelect:t,selectedPart:i,isGlowing:n,isLED:r,isolatePart:s}){const c=h.useRef(),o=m&&!s?2.5:0,a=m&&!s?1.2:0,d=0,l=m&&!s?-1.5:0,u=m&&!s?-2.8:0,p=h.useRef(),x=h.useRef(),g=h.useRef(),v=h.useRef(),y=h.useRef();Pe((w,D)=>{p.current&&(p.current.position.y=I.lerp(p.current.position.y,o,5*D)),x.current&&(x.current.position.y=I.lerp(x.current.position.y,a,5*D)),g.current&&(g.current.position.y=I.lerp(g.current.position.y,d,5*D)),v.current&&(v.current.position.y=I.lerp(v.current.position.y,l,5*D)),y.current&&(y.current.position.y=I.lerp(y.current.position.y,u,5*D)),!m&&c.current?c.current.rotation.y+=D*.5:m&&c.current&&(c.current.rotation.y=I.lerp(c.current.rotation.y,0,5*D))});const j=({partId:w,label:D,offset:Le=[1.5,0,0]})=>!m||s?null:e.jsx(Oe,{position:Le,center:!0,children:e.jsx("div",{onClick:Ee=>{Ee.stopPropagation(),t(w)},style:{background:i===w?"var(--accent)":"rgba(15, 23, 42, 0.8)",color:"white",padding:"4px 8px",borderRadius:"4px",fontSize:"12px",cursor:"pointer",whiteSpace:"nowrap",border:`1px solid ${i===w?"white":"transparent"}`,transition:"all 0.2s",boxShadow:"0 4px 6px rgba(0,0,0,0.1)"},children:D})});if(r)return e.jsxs("group",{ref:c,position:[0,-.5,0],children:[e.jsxs("mesh",{position:[0,1.5,0],onClick:w=>{w.stopPropagation(),t("lens")},children:[e.jsx("cylinderGeometry",{args:[.5,.5,1,32]}),e.jsx("meshPhysicalMaterial",{color:n?"#ef4444":"#f87171",transmission:.9,transparent:!0,opacity:.8,roughness:.1})]}),e.jsxs("mesh",{position:[0,2,0],children:[e.jsx("sphereGeometry",{args:[.5,32,32,0,Math.PI*2,0,Math.PI/2]}),e.jsx("meshPhysicalMaterial",{color:n?"#ef4444":"#f87171",transmission:.9,transparent:!0,opacity:.8,roughness:.1})]}),e.jsxs("mesh",{position:[-.25,0,0],onClick:w=>{w.stopPropagation(),t("positive")},children:[e.jsx("cylinderGeometry",{args:[.05,.05,3]}),e.jsx("meshStandardMaterial",{color:"#94a3b8",metalness:.8,roughness:.2}),m&&e.jsx(j,{partId:"positive",label:"Positive Terminal (Long)",offset:[-1.2,-1,0]}),e.jsxs("mesh",{position:[0,-1.45,0],children:[e.jsx("cylinderGeometry",{args:[.055,.055,.1]}),e.jsx("meshStandardMaterial",{color:"#ef4444"})]})]}),e.jsxs("mesh",{position:[.25,.25,0],onClick:w=>{w.stopPropagation(),t("negative")},children:[e.jsx("cylinderGeometry",{args:[.05,.05,2.5]}),e.jsx("meshStandardMaterial",{color:"#94a3b8",metalness:.8,roughness:.2}),m&&e.jsx(j,{partId:"negative",label:"Negative Terminal (Short)",offset:[1.2,-.5,0]}),e.jsxs("mesh",{position:[0,-1.2,0],children:[e.jsx("cylinderGeometry",{args:[.055,.055,.1]}),e.jsx("meshStandardMaterial",{color:"#3b82f6"})]})]}),e.jsxs("mesh",{position:[.2,1.2,0],onClick:w=>{w.stopPropagation(),t("semiconductor")},children:[e.jsx("boxGeometry",{args:[.1,.4,.1]}),e.jsx("meshStandardMaterial",{color:"#475569",metalness:.5})]}),e.jsxs("mesh",{position:[-.1,1.3,0],children:[e.jsx("boxGeometry",{args:[.3,.2,.1]}),e.jsx("meshStandardMaterial",{color:"#475569",metalness:.5}),m&&e.jsx(j,{partId:"semiconductor",label:"Semiconductor Body",offset:[-1.2,0,0]})]}),n&&e.jsx("pointLight",{position:[0,1.5,0],color:"#ef4444",intensity:2,distance:5})]});let S=[0,0,0],f=1;s&&(s==="bulb"&&(S=[0,-1.2,0],f=1.2),s==="filament"&&(S=[0,-1.2,0],f=3),s==="support"&&(S=[0,-.4,0],f=1.8),s==="case"&&(S=[0,.5,0],f=1.5),s==="tip"&&(S=[0,1.05,0],f=2.5),s==="insulator"&&(S=[0,.9,0],f=2.5));const b=w=>!s||s===w;return e.jsxs("group",{ref:c,position:S,scale:f,children:[e.jsxs("group",{ref:p,visible:b("bulb"),onClick:w=>{w.stopPropagation(),t("bulb")},children:[e.jsxs("mesh",{position:[0,1.2,0],children:[e.jsx("sphereGeometry",{args:[1.2,32,32]}),e.jsx("meshPhysicalMaterial",{color:n?"#fef08a":"#ffffff",transmission:.95,transparent:!0,opacity:.3,roughness:.1,clearcoat:1,emissive:n?"#fef08a":"#000000",emissiveIntensity:n?1:0})]}),e.jsx(j,{partId:"bulb",label:"Glass Bulb",offset:[-1.2,1.5,0]})]}),e.jsxs("group",{ref:x,visible:b("filament"),onClick:w=>{w.stopPropagation(),t("filament")},children:[e.jsxs("mesh",{position:[0,1.2,0],rotation:[Math.PI/2,0,0],children:[e.jsx("torusGeometry",{args:[.2,.02,16,100,Math.PI]}),e.jsx("meshStandardMaterial",{color:n?"#ffffff":"#475569",emissive:n?"#fef08a":"#000000",emissiveIntensity:n?20:0,metalness:n?0:.8,roughness:.2})]}),n&&e.jsxs(e.Fragment,{children:[e.jsx("pointLight",{position:[0,1.2,0],color:"#fef08a",intensity:5,distance:10,decay:2}),e.jsxs("mesh",{position:[0,1.2,0],children:[e.jsx("sphereGeometry",{args:[1.5,32,32]}),e.jsx("meshBasicMaterial",{color:"#fef08a",transparent:!0,opacity:.3,depthWrite:!1})]}),e.jsxs("mesh",{position:[0,1.2,0],children:[e.jsx("sphereGeometry",{args:[3,32,32]}),e.jsx("meshBasicMaterial",{color:"#fef08a",transparent:!0,opacity:.1,depthWrite:!1})]})]}),e.jsx(j,{partId:"filament",label:"Filament",offset:[1.2,1.2,0]})]}),e.jsxs("group",{ref:g,visible:b("support"),onClick:w=>{w.stopPropagation(),t("support")},children:[e.jsxs("mesh",{position:[-.2,.6,0],children:[e.jsx("cylinderGeometry",{args:[.03,.03,1.2]}),e.jsx("meshStandardMaterial",{color:"#94a3b8",metalness:.8,roughness:.2})]}),e.jsxs("mesh",{position:[.2,.6,0],children:[e.jsx("cylinderGeometry",{args:[.03,.03,1.2]}),e.jsx("meshStandardMaterial",{color:"#94a3b8",metalness:.8,roughness:.2})]}),e.jsxs("mesh",{position:[0,.2,0],children:[e.jsx("cylinderGeometry",{args:[.15,.3,.4]}),e.jsx("meshPhysicalMaterial",{color:"#38bdf8",transmission:.8,transparent:!0,opacity:.6})]}),e.jsx(j,{partId:"support",label:"Thick Support Wires",offset:[-1.2,.6,0]})]}),e.jsxs("group",{ref:v,visible:b("case"),onClick:w=>{w.stopPropagation(),t("case")},children:[e.jsxs("mesh",{position:[0,-.4,0],children:[e.jsx("cylinderGeometry",{args:[.5,.4,.8,32]}),e.jsx("meshStandardMaterial",{color:"#cbd5e1",metalness:.9,roughness:.3})]}),[...Array(3)].map((w,D)=>e.jsxs("mesh",{position:[0,-.2-D*.2,0],children:[e.jsx("torusGeometry",{args:[.45-D*.02,.05,16,32]}),e.jsx("meshStandardMaterial",{color:"#cbd5e1",metalness:.9,roughness:.3})]},D)),e.jsx(j,{partId:"case",label:"Metal Case (Terminal)",offset:[1.2,-.4,0]})]}),e.jsxs("group",{ref:y,visible:b("tip")||b("insulator"),onClick:w=>{w.stopPropagation(),t("tip")},children:[e.jsxs("mesh",{position:[0,-.9,0],visible:b("insulator"),children:[e.jsx("cylinderGeometry",{args:[.4,.2,.2,32]}),e.jsx("meshStandardMaterial",{color:"#0f172a",roughness:.8})]}),e.jsx(j,{partId:"insulator",label:"Insulator",offset:[-1.2,-.9,0]}),e.jsxs("mesh",{position:[0,-1.05,0],visible:b("tip"),children:[e.jsx("sphereGeometry",{args:[.15,16,16,0,Math.PI*2,0,Math.PI/2]}),e.jsx("meshStandardMaterial",{color:"#94a3b8",metalness:.7,roughness:.4})]}),e.jsx(j,{partId:"tip",label:"Metal Tip (Terminal)",offset:[1.2,-1.05,0]})]})]})}const et={bulb:{title:"Glass Bulb",desc:"A sealed glass case that protects the filament. It is usually filled with an inert gas like Argon to prevent the filament from burning out."},filament:{title:"Filament",desc:"A very thin wire (usually made of Tungsten) that becomes extremely hot and glows when electric current passes through it, producing light."},support:{title:"Thick Support Wires",desc:"These wires hold the delicate filament in place. One wire connects to the metal case, and the other connects to the metal tip at the base."},case:{title:"Metal Case",desc:"The threaded metal base of the bulb. This acts as one of the two electrical terminals."},tip:{title:"Metal Tip",desc:"The very bottom of the bulb. This acts as the second electrical terminal. It must not touch the metal case directly!"},insulator:{title:"Insulator",desc:"A black non-conducting material that separates the metal tip from the metal case, ensuring current flows *through* the filament."}};function tt({onComplete:m}){const[t,i]=h.useState(!1),[n,r]=h.useState(null),s=K.useRef(),c=l=>{if(s.current){const u=s.current,p=u.object,x=u.target,g=p.position.x-x.x,v=p.position.y-x.y,y=p.position.z-x.z,j=Math.sqrt(g*g+v*v+y*y),f=Math.max(4,Math.min(12,j+l*1.5))/j;p.position.x=x.x+g*f,p.position.y=x.y+v*f,p.position.z=x.z+y*f,u.update()}},o=l=>{r(l)},a=()=>{r(null)},d=n?et[n]:null;return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem",height:"100%"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{style:{maxWidth:"600px"},children:[e.jsx("h3",{style:{margin:"0 0 0.5rem 0",color:"var(--text-heading)",fontSize:"1.5rem"},children:"Inside an Incandescent Lamp"}),e.jsx("p",{style:{margin:0,color:"var(--text-secondary)",lineHeight:"1.6"},children:"What exactly is inside a torch bulb? Toggle the exploded view and click on the different parts to learn about their functions."})]}),e.jsxs("button",{onClick:()=>{i(!t),r(null)},className:"primary",style:{display:"flex",alignItems:"center",gap:"0.5rem",padding:"0.75rem 1.5rem",background:t?"var(--warning)":"var(--accent)"},children:[t?e.jsx(Ze,{size:18}):e.jsx(fe,{size:18}),t?"Reassemble Lamp":"Exploded View"]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 350px",gap:"2rem",flex:1},children:[e.jsxs("div",{className:"glass-panel",style:{position:"relative",borderRadius:"12px",overflow:"hidden",background:"#0f172a",minHeight:"500px"},children:[e.jsxs("div",{style:{position:"absolute",top:20,left:20,zIndex:10,color:"rgba(255,255,255,0.7)",fontSize:"0.85rem",display:"flex",alignItems:"center",gap:"0.5rem",background:"rgba(0,0,0,0.5)",padding:"0.5rem 1rem",borderRadius:"20px"},children:[e.jsx(je,{size:16})," Left-click/drag to rotate. Right-click to pan."]}),e.jsxs("div",{style:{position:"absolute",bottom:20,right:20,zIndex:10,display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx("button",{onClick:l=>{l.preventDefault(),c(-1)},className:"primary",style:{padding:"0.5rem",background:"rgba(59, 130, 246, 0.8)"},children:e.jsx(te,{size:20})}),e.jsx("button",{onClick:l=>{l.preventDefault(),c(1)},className:"primary",style:{padding:"0.5rem",background:"rgba(59, 130, 246, 0.8)"},children:e.jsx(ie,{size:20})})]}),e.jsxs(H,{camera:{position:[0,0,8],fov:45},onPointerMissed:a,children:[e.jsx("ambientLight",{intensity:.5}),e.jsx("spotLight",{position:[10,10,10],angle:.15,penumbra:1,intensity:1}),e.jsx(se,{preset:"city"}),e.jsx(P,{exploded:t,onPartSelect:o,selectedPart:n,isGlowing:!1,isLED:!1}),e.jsx(ne,{position:[0,-2.5,0],opacity:.5,scale:10,blur:2,far:4}),e.jsx(F,{ref:s,enableZoom:!1,enablePan:!0,minDistance:4,maxDistance:12,dampingFactor:.05})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1.5rem"},children:[e.jsxs("div",{className:"glass-panel",style:{padding:"1.5rem",border:"1px solid var(--border)",flex:1,display:"flex",flexDirection:"column"},children:[e.jsx("h4",{style:{margin:"0 0 1rem 0",color:"var(--text-heading)",borderBottom:"1px solid var(--border)",paddingBottom:"0.5rem"},children:"Component Inspection"}),d?e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx("h5",{style:{margin:0,fontSize:"1.1rem",color:"var(--accent)"},children:d.title}),e.jsx("p",{style:{margin:0,fontSize:"0.95rem",color:"var(--text-secondary)",lineHeight:"1.6"},children:d.desc}),n==="filament"&&e.jsxs("div",{style:{marginTop:"1rem",padding:"0.75rem",background:"rgba(59, 130, 246, 0.1)",borderRadius:"8px",color:"var(--text-secondary)",fontSize:"0.85rem"},children:[e.jsx("strong",{children:"Did you know?"})," The filament gets so hot that if it were exposed to normal air, it would instantly catch fire and break. That's why the glass bulb is sealed!"]}),e.jsx("div",{style:{marginTop:"1rem",height:"150px",background:"var(--bg-color)",borderRadius:"8px",overflow:"hidden",border:"1px solid var(--border)"},children:e.jsxs(H,{camera:{position:[0,0,5],fov:45},children:[e.jsx("ambientLight",{intensity:.6}),e.jsx("spotLight",{position:[5,5,5],angle:.3,penumbra:1,intensity:1}),e.jsx(P,{exploded:!0,onPartSelect:()=>{},selectedPart:null,isGlowing:!1,isLED:!1,isolatePart:n}),e.jsx(F,{enableZoom:!0,enablePan:!0,autoRotate:!0,autoRotateSpeed:2,minDistance:2,maxDistance:10})]})})]}):e.jsx("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flex:1,color:"var(--text-faint)",textAlign:"center",gap:"1rem"},children:t?e.jsxs(e.Fragment,{children:[e.jsx(fe,{size:32,style:{opacity:.5}}),e.jsx("p",{style:{margin:0},children:"Click on any floating component to read about its function."})]}):e.jsxs(e.Fragment,{children:[e.jsx(W,{size:32,style:{opacity:.5}}),e.jsxs("p",{style:{margin:0},children:["Click ",e.jsx("strong",{children:"Exploded View"})," to break the lamp apart and see what's inside."]})]})})]}),e.jsxs("button",{onClick:m,className:"primary",style:{width:"100%",display:"flex",justifyContent:"center",alignItems:"center",gap:"0.5rem",padding:"1rem"},children:["Continue to Observation ",e.jsx(V,{size:18})]})]})]})]})}function it({onComplete:m}){const[t,i]=h.useState(!1),n=K.useRef(),r=s=>{if(n.current){const c=n.current,o=c.object,a=c.target,d=o.position.x-a.x,l=o.position.y-a.y,u=o.position.z-a.z,p=Math.sqrt(d*d+l*l+u*u),g=Math.max(4,Math.min(12,p+s*1.5))/p;o.position.x=a.x+d*g,o.position.y=a.y+l*g,o.position.z=a.z+u*g,c.update()}};return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem",height:"100%"},children:[e.jsxs("div",{style:{textAlign:"center",maxWidth:"700px",margin:"0 auto"},children:[e.jsx("h3",{style:{margin:"0 0 0.5rem 0",color:"var(--text-heading)",fontSize:"1.5rem"},children:"Observing the Glow"}),e.jsx("p",{style:{margin:0,color:"var(--text-secondary)",lineHeight:"1.6"},children:"Connect the lamp to a battery and turn on the switch. Observe exactly which part of the lamp produces the light."})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 350px",gap:"2rem",flex:1},children:[e.jsxs("div",{className:"glass-panel",style:{position:"relative",borderRadius:"12px",overflow:"hidden",background:"#0f172a",minHeight:"500px"},children:[e.jsxs("div",{style:{position:"absolute",bottom:20,right:20,zIndex:10,display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx("button",{onClick:s=>{s.preventDefault(),r(-1)},className:"primary",style:{padding:"0.5rem",background:"rgba(59, 130, 246, 0.8)"},children:e.jsx(te,{size:20})}),e.jsx("button",{onClick:s=>{s.preventDefault(),r(1)},className:"primary",style:{padding:"0.5rem",background:"rgba(59, 130, 246, 0.8)"},children:e.jsx(ie,{size:20})})]}),e.jsxs(H,{camera:{position:[0,0,8],fov:45},children:[e.jsx("ambientLight",{intensity:t?.2:.5}),e.jsx("spotLight",{position:[10,10,10],angle:.15,penumbra:1,intensity:1}),e.jsx(se,{preset:"city"}),e.jsx("group",{position:[0,1,0],children:e.jsx(P,{exploded:!1,onPartSelect:()=>{},selectedPart:null,isGlowing:t,isLED:!1})}),e.jsxs("group",{position:[-2,-1.5,0],children:[e.jsxs("mesh",{position:[0,0,0],children:[e.jsx("cylinderGeometry",{args:[.6,.6,1.5,32]}),e.jsx("meshStandardMaterial",{color:"#1e40af",metalness:.5})]}),e.jsxs("mesh",{position:[0,.8,0],children:[e.jsx("cylinderGeometry",{args:[.2,.2,.2,32]}),e.jsx("meshStandardMaterial",{color:"#94a3b8",metalness:.8})]})]}),e.jsxs("group",{position:[2,-1.5,0],children:[e.jsxs("mesh",{position:[0,-.2,0],children:[e.jsx("boxGeometry",{args:[1.5,.2,1]}),e.jsx("meshStandardMaterial",{color:"#475569"})]}),e.jsxs("mesh",{position:[0,.1,0],rotation:[t?Math.PI/8:-Math.PI/8,0,0],children:[e.jsx("boxGeometry",{args:[.8,.1,.8]}),e.jsx("meshStandardMaterial",{color:t?"#10b981":"#ef4444"})]})]}),e.jsx($,{start:[-2,-.6,0],end:[1.25,-1.4,0],mid:[-.5,-2.5,0],color:"#ef4444",lineWidth:5}),e.jsx($,{start:[2.75,-1.4,0],end:[0,-.05,0],mid:[1.5,-.5,0],color:"#3b82f6",lineWidth:5}),e.jsx($,{start:[-.55,.6,0],end:[-2,-2.25,0],mid:[-3,-1,0],color:"#10b981",lineWidth:5}),t&&e.jsx("group",{}),e.jsx(ne,{position:[0,-2.5,0],opacity:.5,scale:10,blur:2,far:4}),e.jsx(F,{ref:n,enableZoom:!1,enablePan:!0,minDistance:4,maxDistance:12,dampingFactor:.05})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1.5rem"},children:[e.jsxs("div",{className:"glass-panel",style:{padding:"2rem",display:"flex",flexDirection:"column",alignItems:"center",gap:"1.5rem",border:"1px solid var(--border)"},children:[e.jsx("h4",{style:{margin:0,fontSize:"1.2rem",color:"var(--text-heading)"},children:"Circuit Switch"}),e.jsx("button",{onClick:()=>i(!t),style:{width:"100px",height:"50px",borderRadius:"25px",background:t?"var(--success)":"#64748b",border:"none",position:"relative",cursor:"pointer",transition:"background 0.3s"},children:e.jsx(re.div,{animate:{x:t?50:0},style:{width:"44px",height:"44px",borderRadius:"50%",background:"white",position:"absolute",top:"3px",left:"3px",boxShadow:"0 2px 4px rgba(0,0,0,0.2)",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(Ne,{size:24,color:t?"var(--success)":"#64748b"})})}),e.jsx("div",{style:{padding:"1rem",background:t?"var(--success-bg)":"var(--surface)",borderRadius:"8px",border:`1px solid ${t?"var(--success-border)":"var(--border)"}`,textAlign:"center",width:"100%"},children:t?e.jsxs(e.Fragment,{children:[e.jsx(Ge,{size:24,color:"var(--warning)",style:{marginBottom:"0.5rem"}}),e.jsxs("p",{style:{margin:0,fontSize:"0.9rem",color:"var(--success)"},children:[e.jsx("strong",{children:"The circuit is complete!"})," Current flows through the filament. The filament gets extremely hot and glows brightly, producing light."]})]}):e.jsx("p",{style:{margin:0,fontSize:"0.9rem",color:"var(--text-secondary)"},children:"The circuit is broken. No current flows, and the filament remains cool and dark."})})]}),e.jsxs("button",{onClick:m,disabled:!t,className:t?"primary":"outline",style:{width:"100%",display:"flex",justifyContent:"center",alignItems:"center",gap:"0.5rem",padding:"1rem",marginTop:"auto"},children:["Compare with LED ",e.jsx(V,{size:18})]})]})]})]})}function st({onComplete:m}){const[t,i]=h.useState(!1),[n,r]=h.useState(!1),s=K.useRef(),c=o=>{if(s.current){const a=s.current,d=a.object,l=a.target,u=d.position.x-l.x,p=d.position.y-l.y,x=d.position.z-l.z,g=Math.sqrt(u*u+p*p+x*x),y=Math.max(4,Math.min(12,g+o*1.5))/g;d.position.x=l.x+u*y,d.position.y=l.y+p*y,d.position.z=l.z+x*y,a.update()}};return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem",height:"100%"},children:[e.jsxs("div",{style:{textAlign:"center",maxWidth:"700px",margin:"0 auto"},children:[e.jsx("h3",{style:{margin:"0 0 0.5rem 0",color:"var(--text-heading)",fontSize:"1.5rem"},children:"Compare with an LED"}),e.jsx("p",{style:{margin:0,color:"var(--text-secondary)",lineHeight:"1.6"},children:"Modern torches use Light Emitting Diodes (LEDs) instead of incandescent lamps. Explore how they differ and test the LED's polarity!"})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 350px",gap:"2rem",flex:1},children:[e.jsxs("div",{className:"glass-panel",style:{position:"relative",borderRadius:"12px",overflow:"hidden",background:"#0f172a",minHeight:"500px"},children:[e.jsxs("div",{style:{position:"absolute",top:20,left:20,zIndex:10,color:"rgba(255,255,255,0.7)",fontSize:"0.85rem",display:"flex",alignItems:"center",gap:"0.5rem",background:"rgba(0,0,0,0.5)",padding:"0.5rem 1rem",borderRadius:"20px"},children:[e.jsx(je,{size:16})," Drag to rotate the LED and Lamp."]}),e.jsxs("div",{style:{position:"absolute",bottom:20,right:20,zIndex:10,display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx("button",{onClick:o=>{o.preventDefault(),c(-1)},className:"primary",style:{padding:"0.5rem",background:"rgba(59, 130, 246, 0.8)"},children:e.jsx(te,{size:20})}),e.jsx("button",{onClick:o=>{o.preventDefault(),c(1)},className:"primary",style:{padding:"0.5rem",background:"rgba(59, 130, 246, 0.8)"},children:e.jsx(ie,{size:20})})]}),e.jsxs(H,{camera:{position:[0,0,8],fov:45},children:[e.jsx("ambientLight",{intensity:.5}),e.jsx("spotLight",{position:[10,10,10],angle:.15,penumbra:1,intensity:1}),e.jsx(se,{preset:"city"}),e.jsx("group",{position:[-2,-.25,0],rotation:[0,t?Math.PI:0,0],children:e.jsx(P,{exploded:!0,onPartSelect:()=>{},selectedPart:null,isGlowing:!t,isLED:!0})}),e.jsx("group",{position:[3,1,0],children:e.jsx(P,{exploded:!1,onPartSelect:()=>{},selectedPart:null,isGlowing:!0,isLED:!1})}),e.jsxs("group",{position:[-2,-2.5,0],children:[e.jsxs("mesh",{position:[0,0,0],children:[e.jsx("boxGeometry",{args:[2,.5,1]}),e.jsx("meshStandardMaterial",{color:"#475569"})]}),e.jsxs("group",{position:[-.25,.25,0],children:[e.jsx("boxGeometry",{args:[.25,.1,.3]}),e.jsx("meshStandardMaterial",{color:"#ef4444",emissive:"#ef4444",emissiveIntensity:.2}),e.jsx(pe,{position:[0,.06,0],rotation:[-Math.PI/2,0,0],fontSize:.2,color:"white",anchorX:"center",anchorY:"middle",children:"+"})]}),e.jsxs("group",{position:[.25,.25,0],children:[e.jsx("boxGeometry",{args:[.25,.1,.3]}),e.jsx("meshStandardMaterial",{color:"#3b82f6",emissive:"#3b82f6",emissiveIntensity:.2}),e.jsx(pe,{position:[0,.06,0],rotation:[-Math.PI/2,0,0],fontSize:.2,color:"white",anchorX:"center",anchorY:"middle",children:"-"})]})]}),e.jsx(ne,{position:[0,-2.5,0],opacity:.5,scale:10,blur:2,far:4}),e.jsx(F,{ref:s,enableZoom:!1,enablePan:!0,minDistance:4,maxDistance:12,dampingFactor:.05})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1.5rem"},children:[e.jsxs("div",{className:"glass-panel",style:{padding:"1.5rem",display:"flex",flexDirection:"column",gap:"1rem",border:"1px solid var(--border)"},children:[e.jsx("h4",{style:{margin:0,fontSize:"1.1rem",color:"var(--text-heading)"},children:"LED Polarity Test"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem",fontSize:"0.9rem",color:"var(--text-secondary)",lineHeight:"1.5"},children:[e.jsxs("p",{style:{margin:0},children:["Unlike a filament bulb which works in any direction, an LED has a strict polarity. The ",e.jsx("strong",{children:"longer wire"})," is the positive (+) terminal."]}),e.jsxs("p",{style:{margin:0,padding:"0.75rem",background:"rgba(255,255,255,0.05)",borderRadius:"8px",borderLeft:"3px solid var(--accent)"},children:["In a basic circuit, the longer lead (positive terminal / anode) should be connected to the positive (+) terminal of the battery or power source.",e.jsx("br",{}),e.jsx("br",{}),"The shorter lead (negative terminal / cathode) should be connected back to the negative (−) terminal."]})]}),e.jsx("button",{onClick:()=>i(!t),className:"outline",style:{padding:"0.75rem",width:"100%",display:"flex",justifyContent:"center",gap:"0.5rem"},children:t?"Restore Correct Polarity":"Reverse the LED Polarity"}),t?e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:"0.5rem",color:"var(--warning)",background:"var(--warning-bg)",padding:"0.75rem",borderRadius:"8px",fontSize:"0.85rem",border:"1px solid var(--warning-border)"},children:[e.jsx(We,{size:18,style:{flexShrink:0}}),e.jsx("span",{children:"LED does not glow! The positive (long) terminal is connected to the negative side of the battery."})]}):e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:"0.5rem",color:"var(--success)",background:"var(--success-bg)",padding:"0.75rem",borderRadius:"8px",fontSize:"0.85rem",border:"1px solid var(--success-border)"},children:[e.jsx(B,{size:18,style:{flexShrink:0}}),e.jsx("span",{children:"LED glows! The positive terminal is correctly connected to the positive side of the circuit."})]})]}),e.jsxs("div",{className:"glass-panel",style:{padding:"1.5rem",flex:1,display:"flex",flexDirection:"column",border:"1px solid var(--border)"},children:[e.jsx("button",{onClick:()=>r(!n),className:"primary",style:{width:"100%",padding:"0.75rem",marginBottom:"1rem"},children:n?"Hide Table":"Show Comparison Table"}),n&&e.jsxs(re.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},style:{display:"flex",flexDirection:"column",gap:"0.5rem",fontSize:"0.8rem"},children:[e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",fontWeight:"bold",borderBottom:"1px solid var(--border)",paddingBottom:"0.5rem",color:"var(--text-heading)"},children:[e.jsx("div",{children:"Incandescent"}),e.jsx("div",{children:"LED"})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",padding:"0.25rem 0",borderBottom:"1px solid rgba(255,255,255,0.05)"},children:[e.jsx("div",{style:{color:"var(--text-secondary)"},children:"Has a hot filament"}),e.jsx("div",{style:{color:"var(--accent)"},children:"No filament (semiconductor)"})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",padding:"0.25rem 0",borderBottom:"1px solid rgba(255,255,255,0.05)"},children:[e.jsx("div",{style:{color:"var(--text-secondary)"},children:"Produces much heat"}),e.jsx("div",{style:{color:"var(--accent)"},children:"Produces very little heat"})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",padding:"0.25rem 0",borderBottom:"1px solid rgba(255,255,255,0.05)"},children:[e.jsx("div",{style:{color:"var(--text-secondary)"},children:"Uses more energy"}),e.jsx("div",{style:{color:"var(--accent)"},children:"Highly energy-efficient"})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",padding:"0.25rem 0"},children:[e.jsx("div",{style:{color:"var(--text-secondary)"},children:"Works in any direction"}),e.jsx("div",{style:{color:"var(--accent)"},children:"Strict polarity (+ and -)"})]})]}),e.jsxs("button",{onClick:m,className:"primary",style:{width:"100%",display:"flex",justifyContent:"center",alignItems:"center",gap:"0.5rem",padding:"1rem",marginTop:"auto"},children:["Proceed to Quiz ",e.jsx(V,{size:18})]})]})]})]})]})}const k=[{id:1,question:"Which part of an incandescent lamp actually glows to produce light?",options:["Glass Bulb","Filament","Metal Case","Metal Tip"],correctAnswer:1,explanation:"The filament is a very thin wire that becomes extremely hot and glows when electric current passes through it."},{id:2,question:"Does an LED (Light Emitting Diode) contain a filament?",options:["Yes, a very small one","No, it uses a semiconductor","Yes, but it doesn't get hot","Only in red LEDs"],correctAnswer:1,explanation:"LEDs do not have filaments! They produce light by passing current through a semiconductor material, which makes them very efficient."},{id:3,question:"When looking at an LED, how can you identify the positive (+) terminal?",options:["It is the shorter lead","It is painted red","It is the longer lead","It is thicker than the other"],correctAnswer:2,explanation:"The longer lead of an LED is the positive (+) terminal, and the shorter lead is the negative (−) terminal."},{id:4,question:"Which type of lamp produces MORE heat while operating?",options:["Incandescent Lamp","LED","They produce the same amount","Neither produces heat"],correctAnswer:0,explanation:"Incandescent lamps produce light by heating the filament until it glows. Most of the energy is actually wasted as heat! LEDs run much cooler."},{id:5,question:"What happens if you connect an LED backwards (reverse polarity) in a simple circuit?",options:["It glows much brighter","It changes color","It explodes","It does not glow at all"],correctAnswer:3,explanation:"Unlike incandescent bulbs, LEDs only allow current to flow in one direction. If connected backwards, the circuit is broken and it will not glow."}];function nt({onComplete:m}){const[t,i]=h.useState(0),[n,r]=h.useState(null),[s,c]=h.useState(!1),[o,a]=h.useState(0),[d,l]=h.useState(!1),u=v=>{s||r(v)},p=()=>{n===k[t].correctAnswer&&a(v=>v+1),c(!0)},x=()=>{t<k.length-1?(i(v=>v+1),r(null),c(!1)):l(!0)};if(d){const v=o/k.length*100;let y="";return v===100?y="Perfect Score! You are a Lamp Expert!":v>=80?y="Great job! You know your circuits well.":v>=60?y="Good effort! Review the differences between LEDs and filaments.":y="Keep learning! Try the lab again to solidify the concepts.",e.jsxs("div",{className:"glass-panel",style:{padding:"3rem",maxWidth:"600px",margin:"0 auto",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:"2rem"},children:[e.jsx(B,{size:64,style:{color:"var(--success)"}}),e.jsxs("div",{children:[e.jsx("h2",{style:{margin:"0 0 1rem 0",color:"var(--text-heading)",fontSize:"2rem"},children:"Quiz Complete!"}),e.jsxs("p",{style:{margin:0,color:"var(--text-secondary)",fontSize:"1.2rem"},children:["You scored ",o," out of ",k.length," (",v,"%)"]})]}),e.jsx("div",{style:{padding:"1.5rem",background:"var(--surface)",borderRadius:"12px",width:"100%",border:"1px solid var(--border)"},children:e.jsx("p",{style:{margin:0,color:"var(--accent)",fontWeight:"bold",fontSize:"1.1rem"},children:y})}),e.jsxs("div",{style:{display:"flex",gap:"1rem",width:"100%",marginTop:"1rem"},children:[e.jsxs("button",{onClick:()=>{i(0),r(null),c(!1),a(0),l(!1)},className:"outline",style:{flex:1,padding:"1rem",display:"flex",justifyContent:"center",alignItems:"center",gap:"0.5rem"},children:[e.jsx(He,{size:18})," Retake Quiz"]}),e.jsxs("button",{onClick:()=>m({score:o,total:k.length}),className:"primary",style:{flex:1,padding:"1rem",display:"flex",justifyContent:"center",alignItems:"center",gap:"0.5rem"},children:["Finish Lab ",e.jsx(B,{size:18})]})]})]})}const g=k[t];return e.jsxs("div",{style:{maxWidth:"800px",margin:"0 auto",display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("h3",{style:{margin:0,color:"var(--text-heading)",fontSize:"1.5rem"},children:"Concept Check"}),e.jsxs("div",{style:{background:"var(--surface)",padding:"0.5rem 1rem",borderRadius:"20px",fontSize:"0.9rem",color:"var(--text-secondary)",border:"1px solid var(--border)"},children:["Question ",t+1," of ",k.length]})]}),e.jsxs("div",{className:"glass-panel",style:{padding:"2rem",display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsx("h4",{style:{margin:0,fontSize:"1.25rem",color:"var(--text-heading)",lineHeight:"1.5"},children:g.question}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:g.options.map((v,y)=>{const j=n===y;let S="var(--border)",f="var(--surface)",b="var(--text-secondary)";return s?y===g.correctAnswer?(S="var(--success)",f="var(--success-bg)",b="var(--success)"):j&&(S="#ef4444",f="rgba(239, 68, 68, 0.1)",b="#ef4444"):j&&(S="var(--accent)",f="var(--accent-bg)",b="var(--accent)"),e.jsxs("button",{onClick:()=>u(y),disabled:s,style:{display:"flex",alignItems:"center",gap:"1rem",padding:"1rem 1.5rem",background:f,border:`2px solid ${S}`,borderRadius:"12px",color:b,fontSize:"1.05rem",textAlign:"left",cursor:s?"default":"pointer",transition:"all 0.2s",transform:j&&!s?"translateX(5px)":"none"},children:[e.jsxs("div",{style:{width:"24px",height:"24px",borderRadius:"50%",border:`2px solid ${S}`,display:"flex",alignItems:"center",justifyContent:"center",background:j||s&&y===g.correctAnswer?S:"transparent"},children:[s&&y===g.correctAnswer&&e.jsx(B,{size:16,color:"white"}),s&&j&&y!==g.correctAnswer&&e.jsx(Fe,{size:16,color:"white"})]}),v]},y)})}),e.jsx(Ve,{children:s&&e.jsx(re.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},style:{overflow:"hidden"},children:e.jsxs("div",{style:{marginTop:"1rem",padding:"1.5rem",background:"rgba(59, 130, 246, 0.1)",borderLeft:"4px solid var(--accent)",borderRadius:"0 8px 8px 0",display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx("span",{style:{fontWeight:"bold",color:"var(--accent)"},children:"Explanation:"}),e.jsx("span",{style:{color:"var(--text-secondary)",lineHeight:"1.6"},children:g.explanation})]})})})]}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-end"},children:s?e.jsxs("button",{className:"primary",onClick:x,style:{padding:"0.75rem 2rem",fontSize:"1.1rem",display:"flex",alignItems:"center",gap:"0.5rem"},children:[t<k.length-1?"Next Question":"View Results"," ",e.jsx(V,{size:20})]}):e.jsx("button",{className:"primary",onClick:p,disabled:n===null,style:{padding:"0.75rem 2rem",fontSize:"1.1rem"},children:"Check Answer"})})]})}const Y=[{id:1,title:"1. Explore Lamp",icon:W},{id:2,title:"2. Observe Glow",icon:W},{id:3,title:"3. Compare LED",icon:W},{id:4,title:"4. Quiz",icon:B}];function jt({onBackToDashboard:m}){const[t,i]=h.useState(1),[n,r]=h.useState([!1,!1,!1,!1]),[s,c]=h.useState(null),o=(d,l=null)=>{r(u=>{const p=[...u];return p[d]=!0,p}),l&&c(l),d+1<Y.length&&i(d+2)},a=n.filter(Boolean).length/Y.length*100;return e.jsxs("div",{className:"activity-container glass-panel",style:{minHeight:"calc(100vh - 120px)",display:"flex",flexDirection:"column"},children:[e.jsxs("div",{className:"activity-header",style:{padding:"1.5rem 2rem",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center",background:"var(--surface)"},children:[e.jsxs("div",{children:[e.jsxs("button",{onClick:m,className:"outline",style:{padding:"0.4rem 0.8rem",fontSize:"0.8rem",gap:"0.35rem",marginBottom:"1rem"},children:[e.jsx(De,{size:14})," Back to Class 7 Chapter 3"]}),e.jsx("h2",{style:{margin:0,color:"var(--text-heading)",display:"flex",alignItems:"center",gap:"0.5rem"},children:"Lamp Explorer Lab"}),e.jsx("span",{style:{fontSize:"0.85rem",color:"var(--text-secondary)"},children:"Electricity and Circuits (Activities 3.4 - 3.5)"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"2rem"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.75rem",color:"var(--text-muted)"},children:[e.jsx("span",{children:"Progress"}),e.jsxs("span",{children:[Math.round(a),"%"]})]}),e.jsx("div",{style:{width:"150px",height:"6px",background:"var(--border)",borderRadius:"3px",overflow:"hidden"},children:e.jsx("div",{style:{height:"100%",width:`${a}%`,background:"var(--accent)",transition:"width 0.3s"}})})]}),e.jsx("div",{style:{display:"flex",gap:"0.5rem"},children:Y.map((d,l)=>{const u=d.icon,p=n[l],x=t===d.id;return e.jsxs("button",{onClick:()=>i(d.id),disabled:l>0&&!n[l-1]&&!p&&!x,style:{padding:"0.5rem 1rem",borderRadius:"20px",border:"none",background:x?"var(--accent)":p?"var(--success-bg)":"transparent",color:x?"white":p?"var(--success)":"var(--text-muted)",display:"flex",alignItems:"center",gap:"0.5rem",fontSize:"0.8rem",cursor:l>0&&!n[l-1]&&!p&&!x?"not-allowed":"pointer",transition:"all 0.2s"},children:[e.jsx(u,{size:14}),d.title," ",p&&e.jsx(B,{size:14})]},d.id)})})]})]}),e.jsxs("div",{style:{flex:1,padding:"2rem",background:"var(--bg-color)"},children:[t===1&&e.jsx(tt,{onComplete:()=>o(0)}),t===2&&e.jsx(it,{onComplete:()=>o(1)}),t===3&&e.jsx(st,{onComplete:()=>o(2)}),t===4&&e.jsx(nt,{onComplete:d=>o(3,d)})]})]})}export{jt as default};
