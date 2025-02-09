package main

import (
	"fmt"

	"github.com/ss49919201/kimyou/scripts/insert-to-d1/query"
)

func main() {
	sql, args := query.CreateManyMontos([]query.Monto{
		{
			FirstName:   "苗字",
			LastName:    "名前",
			DateOfDeath: "2006-01-02T15:04:05Z07:00",
			Address:     "住所",
		},
	})

	fmt.Println(sql, args)
}
