#!/usr/local/bin/python
import csv
import json
import os

jsonfile = open('../app/data/data.json', 'w')
csvfile = open('data.csv', 'rb')

# earth-like
# http://www.space.com/30172-six-most-earth-like-alien-planets.html

# potentially habitable
# https://en.wikipedia.org/wiki/List_of_potentially_habitable_exoplanets

fieldnames = [
    "pl_hostname",
    "pl_name",
    "pl_rade",
    "pl_radj",
    "pl_massj",
    "pl_masse",
    "pl_dens",
    "pl_eqt",
    "pl_telescope",
    "pl_facility",
    "pl_disc",
    "pl_discmethod",
    "pl_pnum",
    "pl_orbper",
    "st_dist",
    "st_optmag",
    "st_teff",
    "st_mass",
    "st_rad",
    "hip_name",
    "hd_name",
    "st_age",
    "ra",
    "dec",
    "pl_pelink",
    "pl_edelink",
    "rowupdate"
]
reader = csv.DictReader(csvfile, fieldnames)

output = "["

for row in reader:
    # jsonfile = open(jsondir + '/' + row['pl_name'].replace(' ', '') + '.json', 'w+')
    if reader.line_num == 1:
        continue
    output = output + json.dumps(row) + ","

output = output[0:-1]
output = output + "]"

all_data = json.loads(output)

keys_to_delete = []

# kill empty data
for row in all_data:
    line = all_data.index(row)
    for key in row:
        if row[key] == "":
            keys_to_delete.append({"row": line, "key": key})

for i in keys_to_delete:
    obj = all_data[i["row"]]
    obj.pop(i["key"], None)

out = json.dumps(all_data, separators=(',',':'))

jsonfile.write(out)