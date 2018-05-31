#!/bin/bash
set -e
sudo chmod 666 /dev/tty1
dmesg -k > /dev/tty1
printf '
                                                                                                    
																			    


							$$$$$$$\   $$$$$$\  $$\      $$\ $$$$$$$$\ $$$$$$$\        $$$$$$$$\  $$$$$$\  $$$$$$\ $$\      $$\   $$\ $$$$$$$\  $$$$$$$$\ 
							$$  __$$\ $$  __$$\ $$ | $\  $$ |$$  _____|$$  __$$\       $$  _____|$$  __$$\ \_$$  _|$$ |     $$ |  $$ |$$  __$$\ $$  _____|
							$$ |  $$ |$$ /  $$ |$$ |$$$\ $$ |$$ |      $$ |  $$ |      $$ |      $$ /  $$ |  $$ |  $$ |     $$ |  $$ |$$ |  $$ |$$ |      
							$$$$$$$  |$$ |  $$ |$$ $$ $$\$$ |$$$$$\    $$$$$$$  |      $$$$$\    $$$$$$$$ |  $$ |  $$ |     $$ |  $$ |$$$$$$$  |$$$$$\    
							$$  ____/ $$ |  $$ |$$$$  _$$$$ |$$  __|   $$  __$$<       $$  __|   $$  __$$ |  $$ |  $$ |     $$ |  $$ |$$  __$$< $$  __|   
							$$ |      $$ |  $$ |$$$  / \$$$ |$$ |      $$ |  $$ |      $$ |      $$ |  $$ |  $$ |  $$ |     $$ |  $$ |$$ |  $$ |$$ |      
							$$ |       $$$$$$  |$$  /   \$$ |$$$$$$$$\ $$ |  $$ |      $$ |      $$ |  $$ |$$$$$$\ $$$$$$$$\\$$$$$$  |$$ |  $$ |$$$$$$$$\ 
							\__|       \______/ \__/     \__|\________|\__|  \__|      \__|      \__|  \__|\______|\________|\______/ \__|  \__|\________|
																							      
																								      
																					    
												:/                                                .:                        
											     :smMMy                                              -NMNs:                     
											  .omMMMMMMh`                                           /NMMMMMmo.                  
											-yNMMMMMMMMMd.                                         oMMMMMMMMMNy-                
										      -yNMMMMMMMMMMMMm-                                      `yMMMMMMMMMMMMNh-              
										    .yNMMMMMMMMMMMMMMMN/                                    `hMMMMMMMMMMMMMMMNy.            
										  `+NMMMMMMMMMMMMMMMMMMNo                                  .dMMMMMMMMMMMMMMMMMMN+`          
										 .hMMMMMMMMMMMMMMMMMMMMMMs`                               -mMMMMMMMMMMMMMMMMMMMMMh.         
										/NMMMMMMMMMMMMMMMMMMMMMMMMh`                             /NMMMMMMMMMMMMMMMMMMMMMMMN/        
									       oNMMMMMMMMMMMMMMMMMMMMMMMMMMd.                           +NMMMMMMMMMMMMMMMMMMMMMMMMMNo       
									      sMMMMMMMMMMMMMMMMMMMMMMMMMMMMMm-                        `sMMMMMMMMMMMMMMMMMMMMMMMMMMMMMs      
									     sMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMN/                      `yMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMs     
									    +MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMN+                    .dMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM+    
									   :NMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM+                  .mMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMN:   
									  `mMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNd+.                  .+dNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMm`  
									  oMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMh:      `.:/oooo/:.`      :hNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMo  
									 `NMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMm/     `/ymMMMMMMMMMMmy/`     :mMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMN` 
									 +MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMh.    `omMMMMMMMMMMMMMMMMmo`    `hMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM+ 
									 dMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMd`    -mMMMMMMMMMMMMMMMMMMMMm-    `dMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMd 
									`MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM.    -NMMMMMMMMMMMMMMMMMMMMMMN-    .MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM`
									-MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMy     mMMMMMMMMMMMMMMMMMMMMMMMMm     yMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM-
									:mmmmmmmmmmmmmmmmmmmmmmmmmmmmmm/    -MMMMMMMMMMMMMMMMMMMMMMMMMM:    /NNNNNNNNNNNNNNNNNNNNNNNNNNNNNN:
													    /MMMMMMMMMMMMMMMMMMMMMMMMMM/                                    
													    .MMMMMMMMMMMMMMMMMMMMMMMMMM.                                    
													     yMMMMMMMMMMMMMMMMMMMMMMMMy                                     
													     `hMMMMMMMMMMMMMMMMMMMMMMh`                                     
													       oNMMMMMMMMMMMMMMMMMMNo`                                      
														.smMMMMMMMMMMMMMMms.                                        
														  `:ohmNMMMMNmho:`                                          
														      ```..```                                              
													       +o-`              `-o/                                       
													      oMMNmhs+/:----:/+shmNMN+                                      
													     sMMMMMMMMMMNNNNNMMMMMMMMMo                                     
													   `yMMMMMMMMMMMMMMMMMMMMMMMMMMo                                    
													  `yMMMMMMMMMMMMMMMMMMMMMMMMMMMMs                                   
													 `hMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMy`                                 
													`dMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMy`                                
												       .dMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMh`                               
												      .mMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMd.                              
												     -mMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMd.                             
												    -NMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMm-                            
												   :NMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMm-                           
												  /NMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMN:                          
												 :NMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMN:                         
												 -+hNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNh+-                         
												    `-+ymNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNmy+-`                            
													 `-/oydNMMMMMMMMMMMMMMMMMMMMNdyo/-`                                 
														`.-://++oooo++//:-.`                                        
																     
                                                     
                                                  ' > /dev/tty1
