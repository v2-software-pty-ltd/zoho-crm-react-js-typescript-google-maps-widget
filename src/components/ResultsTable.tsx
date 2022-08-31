import React from 'react'

import { UnprocessedResultsFromCRM } from '../types'
import { formatDate, convertToCurrency } from '../utils/utils'

type ResultsTableProps = {
    results: UnprocessedResultsFromCRM[]
    filterInUse: string
}

export function ResultsTableWidget (props: ResultsTableProps) {
    return (
        <div>
            {props.filterInUse === 'BaseFilter' &&
             (
                 <div style={{ padding: '30px 20px' }}>
                     <table>
                         <thead>
                             <tr>
                                 <th>No.</th>
                                 
                                 <th>Property Address</th>
                                 
                                 <th style={{ textAlign : 'center' }}>Property Details</th>
                                
                                 
                             </tr>
                         </thead>
                         <tbody>
                         
                             {props.results.map((result, index) => {

                                 let propertyAddress = result.Deal_Name
                                 if (!result.Latitude || !result.Longitude) {
                                     propertyAddress = `${result.Deal_Name} - Geocoordinates N/A, cannot display on map.`
                                 }
                                 const ownerData = result.owner_details?.find((owner) => owner.Contact_Type === 'Owner')
                                 const contactData = result.owner_details?.find((owner) => owner.Contact_Type === 'Director')
                                 const nameOnTitleProperty_list = (result.NameOnTitlePropertyDetails);
                                //  let nameOnTitleProperty = result.NameOnTitlePropertyDetails?.find((owner) => owner.Property.id === result.id)
                                 let nameOnTitleContact_list = result.NameOnTitleContactDetails;
                                 console.log(nameOnTitleProperty_list.length);
                                if (nameOnTitleProperty_list.length > 0 ){
                                    return (
                                        <tr key={`${result.id}-${index}`}>
                                            <td>{index + 1}</td>
                                            <td>{propertyAddress}</td>
                                            
                                            
                                            <td>
                                                <table>
                                                <tr>
                                                    
                                                    <th className={'nested_table'}>Name on Title </th>
                                                   
                                                    
                                                    <th className={'nested_table'}>Contacts</th>
                                                    
                                                   
                                                </tr>
                                                
                                                {nameOnTitleProperty_list.map((property_details, index_property) => (
                                                    <tr data-index={index_property}> 
                                                        <td>{property_details.Name_On_Title.name || 'Name on Title is not found'} &nbsp;
                                                             <br></br>
                                                            {/* {JSON.stringify(nameOnTitleProperty_list)} */}
                                                        </td>  
                                                        
                                                        <td>
                                                        
                                                        {nameOnTitleContact_list.map((contact_details, index_contact) => {
                                                            if (nameOnTitleContact_list.length > 0){
                                                                console.log(JSON.stringify(nameOnTitleContact_list).includes(contact_details.Name_On_Title.id));
                                                                // let list_str = "".join(str(elem) for elem in nameOnTitleContact_list)
                                                                if (JSON.stringify(nameOnTitleContact_list).includes(contact_details.Name_On_Title.id) === false){
                                                                    return (
                                                                        <span>{'Contact is not found'} <br></br></span> 
                                                                    )
                                                                }
                                                                else{
                                                                    if (contact_details.Name_On_Title.id.concat(contact_details.Name_On_Title.name)  === property_details.Name_On_Title.id.concat(property_details.Name_On_Title.name)){
                                                                        if (contact_details?.Contact.name !== ""){
                                                                            console.log(property_details?.Name_On_Title.name);
                                                                            console.log(contact_details?.Contact.name);
                                                                            return (
                                                                                <span>{contact_details?.Contact.name || 'Contact is not found'} <br></br></span> 
                                                                            )
                                                                        }
                                                                        else{
                                                                            return (
                                                                                <span>{'Contact is not found'} <br></br></span> 
                                                                            )
                                                                        }
                                                                        
                                                                    }
                                                                    
                                                                }
                                                            }
                                                            else{
                                                                return (
                                                                    <span>{'Contact is not found'} <br></br></span> 
                                                                )
                                                            }
                                                                
                                                                


                                                                
                                                                // else{
                                                                //     return(
                                                                //         <span></span>
                                                                //     )
                                                                // }
                                                                
                                                                    
                                                                
                                                                
                                                            })}  
                                                            
                                                             
                                                        
                                                        
                                                            </td>  
                                                    </tr>  
                                                    ))}  
                                                
                                                
                                                </table>
                                                
                                               
                                                
                                            </td>
                                            
                                            
                                            
                                           
                                        </tr>
                                    )
                                }
                                // else{
                                //     return (
                                //         <tr key={`${result.id}-${index}`}>
                                //             <td>{index + 1}</td>
                                //             <td>{propertyAddress}</td>
                                            
                                //             <td>
                                //                 {'No Cache Data'}
                                                   
                                                
                                               
                                                
                                //             </td>
                                            
                                            
                                            
                                           
                                //         </tr>
                                //     )
                                // }
                                 
                                
                                
                                    
                                        
                                    
                                    
                                 
                                
                                
                                 
                             })}
                         </tbody>
                     </table>
                 </div>
             )
            }
            {props.filterInUse === 'SalesEvidenceFilter' &&
             (
                 <div style={{ padding: '30px 20px' }}>
                     <table>
                         <thead>
                             <tr>
                                 <th>No.</th>
                                 <th>Address</th>
                                 <th>Land Area</th>
                                 <th>Build Area</th>
                                 <th>Date Sold</th>
                                 <th>Sale Price</th>
                             </tr>
                         </thead>
                         <tbody>
                             {props.results.map((result, index) => {
                                 return (
                                     <tr key={`${result.id}-${index}`}>
                                         <td>{index + 1}</td>
                                         <td>{result.Deal_Name}</td>
                                         <td>{result.Land_Area_sqm}</td>
                                         <td>{result.Build_Area_sqm}</td>
                                         <td>{formatDate(result.Sale_Date)}</td>
                                         <td>{convertToCurrency(result.Sale_Price)}</td>
                                     </tr>
                                 )
                             })}
                         </tbody>
                     </table>
                 </div>
             )
            }
            {props.filterInUse === 'LeasesEvidenceFilter' &&
             (
                 <div style={{ padding: '30px 20px' }}>
                     <table>
                         <thead>
                             <tr>
                                 <th>No.</th>
                                 <th>Address</th>
                                 <th>Tenancy Name</th>
                                 <th>Current $ Per Sqm</th>
                                 <th>Land Area</th>
                                 <th>Area(sqm)</th>
                                 <th>Current Rent (Gross)</th>
                             </tr>
                         </thead>
                         <tbody >
                             {props.results.map((result, index) => {
                                 return (
                                     <tr key={`${result.id}-${index}`}>
                                         <td>{index + 1}</td>
                                         <td>{result.Property.name}</td>
                                         <td>{result.Name}</td>
                                         <td>{convertToCurrency(result.Current_Per_Sqm)}</td>
                                         <td>{result.Land_Area_sqm}</td>
                                         <td>{result.Area_sqm}</td>
                                         <td>{convertToCurrency(result.Current_AI_New_Market_Rental)}</td>
                                     </tr>
                                 )
                             })}
                         </tbody>
                     </table>
                 </div>
             )
            }
        </div>
    )
}
